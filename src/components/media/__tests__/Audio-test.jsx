import React from 'react'
import { shallow, mount } from 'enzyme'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import assign from 'object-assign'
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
	src: '//localhost.localdomain/streaming/stream.mp4',
	type: 'audio/ogg',
	controls: true,
	crossOrigin: true,
	sources: [{src:"foo.ogg", type:"audio/ogg"}]
}

const noop = () => {}

const wrapEl = (xtend, renderer) => {
	const props = assign({}, defaultProps, { onClose: noop }, xtend)

	return renderer(<Audio {...props} />)
}

const shallowEl = xtend => wrapEl(xtend, shallow)
const mountEl = xtend => wrapEl(xtend, mount)

describe('<Audio />', () => {
	it('renders a Audio element', () => {
			const $el = shallowEl()
			expect($el.find(Audio)).to.be.a('Object')
			expect($el.find(Audio).first()).to.be.a('Object')
	})

	it('receives the properties for the audio element', function () {
		const $el = mountEl()
		const player = $el.find(Audio).first()
		expect(player).to.have.prop('poster', '//localhost.localdomain/img/poster.png')
		expect(player).to.have.prop('src', '//localhost.localdomain/streaming/stream.mp4')
		expect(player).to.have.prop('type', 'audio/ogg')
		expect(player).to.have.prop('controls', true)
		expect(player).to.have.prop('crossOrigin', true)
	})

	describe('#sources', () => {
		it('renders source elements', () => {
			const $el = mountEl()
			const player = $el.instance()
			expect($el).to.have.descendants('source')
		})
	})
})

chai.use(chaiEnzyme())
