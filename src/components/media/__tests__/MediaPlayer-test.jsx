import React from 'react'
import { shallow, mount, render } from 'enzyme'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import assign from 'object-assign'
import MediaPlayer from '../MediaPlayer.jsx'
import Video from '../Video.jsx'
import Audio from '../Audio.jsx'

const defaultProps = {
	options: {
		enabled: true,
		html: '',
		controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'fullscreen'],
		i18n: {},
		loadSprite: true,
		iconUrl: null,
		iconPrefix: 'plyr',
		blankUrl: 'https://cdn.selz.com/plyr/blank.mp4',
		debug: false,
		autoplay: false,
		seekTime: 10,
		volume: 5,
		clickToPlay: true,
		disableContextMenu: true,
		hideControls: true,
		showPosterOnEnd: false,
		keyboardShortcuts: { focused: true, global: false },
		tooltips: { controls: false, seek: true },
		duration: null,
		displayDuration: true,
		selectors: {},
		listeners: {},
		classes: {},
		captions: {},
		fullscreen: {'enabled': true, 'fallback': true, 'allowAudio': false},
		storage: { enabled: true, key: 'plyr_volume' }
	},
	poster: '//localhost.localdomain/img/poster.png',
	src: '//localhost.localdomain/streaming/stream.ogg',
	type: 'video/ogg',
	controls: true,
	crossOrigin: true
}

const noop = () => {}

const wrapEl = (xtend, renderer) => {
	const props = assign({}, defaultProps, { onClose: noop }, xtend)

	return renderer(<MediaPlayer {...props} />)
}

const shallowEl = xtend => wrapEl(xtend, shallow)
const mountEl = xtend => wrapEl(xtend, mount)
const renderEl = xtend => wrapEl(xtend, render)

describe('<MediaPlayer />', () => {
	it('renders a MediaPlayer element', () => {
			const $el = shallowEl()
			expect($el.find(MediaPlayer)).to.be.a('Object')
			expect($el.find(MediaPlayer).first()).to.be.ok
	})

	it('receives the properties for the video element', function () {
		const $el = mountEl()
		const player = $el.find(MediaPlayer).first()

		expect(player).to.have.prop('poster','//localhost.localdomain/img/poster.png')
		expect(player).to.have.prop('src','//localhost.localdomain/streaming/stream.ogg')
		expect(player).to.have.prop('type', 'video/ogg')
		expect(player).to.have.prop('controls', true)
		expect(player).to.have.prop('crossOrigin', true)
	})

	describe('#parseType', function () {
		it('sets media element to a Video by parsing the media type', function () {
			const $el = mountEl()
			const player = $el.instance()
			expect($el).to.have.descendants('video')
		})

		it('sets media element to a Audio by parsing the media type', function () {
			const $el = mountEl({type: 'audio/ogg'})
			const player = $el.instance()
			expect($el).to.have.descendants('audio')
		})

		it('raises an exception when setting a media element to an unsupported media type', function () {
			const props = assign({}, defaultProps, {type: 'no-exist/no-exist'})
		})
	})
})

chai.use(chaiEnzyme())
