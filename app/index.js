'use strict'

const { basename, extname } = require('path')
const config = require('./config')
const Garmin = require('./garmin')
const Login = require('./login')
const Storage = require('./storage')
const React = require('react')
const ReactDOM = require('react-dom')
const shell = require('electron').shell
const Strava = require('./strava')
const TrackList = require('./track-list')

const clientId = config.clientId
const clientSecret = config.clientSecret

const storage = new Storage()
const strava = new Strava(clientId, clientSecret, storage.getAuth())
const garmin = new Garmin()
const login = new Login(strava)

login.render()
garmin.startWatching()

class Index extends React.Component {
  constructor(props) {
    super(props)
    this.props = props
    this.state = {}
  }

  render() {
    return React.createElement(TrackList, {
      tracks: this.state.tracks,
      onUploadClick: this.props.onUploadClick,
      onNameChange: this.props.onNameChange,
      onNameFocus: this.props.onNameFocus
    })
  }
}

const index = ReactDOM.render(React.createElement(Index, {
  onUploadClick: uploadTrack,
  onNameChange: onNameChange,
  onNameFocus: onNameFocus
}), document.querySelector('.content'))

strava
  .on('login', auth => storage.setAuth(auth))
  .on('logout', () => storage.deleteAuth())

garmin.on('update', renderTracks)
storage.on('change', renderTracks)

function uploadTrack(trackPath) {
  const track = storage.updateTrack(trackPath, {
    status: 'uploading',
    error: null,
    activityId: null
  })
  strava
    .uploadTrack(Object.assign({path: trackPath}, track))
    .then(status => onUploadSucces(trackPath, status))
    .catch(status => onUploadFail(trackPath, status))
}

function onNameChange(trackPath, name) {
  storage.updateTrack(trackPath, {
    name: name
  })
}

function onNameFocus(trackPath) {
  storage.updateTrack(trackPath, {
    error: null
  })
}

function onUploadSucces(trackPath, status) {
  storage.updateTrack(trackPath, {
    status: 'success',
    error: null,
    activityId: status.activity_id
  })
}

function onUploadFail(trackPath, status) {
  storage.updateTrack(trackPath, {
    status: 'fail',
    error: status.error || 'Upload failed',
    activityId: null
  })
}

function renderTracks() {
  index.setState({tracks: getTracks()})
}

function getTracks() {
  if (garmin.tracks)
    return garmin.tracks
      .map(deviceTrack => [deviceTrack, storage.getTrack(deviceTrack.path)])
      .map(([deviceTrack, storageTrack]) =>
         Object.assign({
           defaultName: nameFromPath(deviceTrack.path)
         }, deviceTrack, storageTrack)
      )
}

function nameFromPath(trackPath) {
  return basename(trackPath, extname(trackPath))
}

document.body.addEventListener('click', event => {
  const a = event.target.closest('a')
  if (a && !event.defaultPrevented) {
    event.preventDefault()
    shell.openExternal(a.href)
  }
}, false)
