import React from 'react'
import { shallow, mount } from 'enzyme'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import assign from 'object-assign'
import Video from '../Video.jsx'

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
	type: 'video/ogg',
	controls: true,
	crossOrigin: true,
	sources: [{src: "foo.ogg", type: "video/ogg"}],
	captions: {	kind: "captions",
							label: "English captions",
							src: "/path/to/captions.vtt",
							srclang: "en",
							default: true }
}

const noop = () => {}

const wrapEl = (xtend, renderer) => {
	const props = assign({}, defaultProps, { onClose: noop }, xtend)
	return renderer(<Video {...props} />)
}

const shallowEl = xtend => wrapEl(xtend, shallow)
const mountEl = xtend => wrapEl(xtend, mount)

describe('<Video />', () => {
	it('renders a Video element', () => {
			const $el = shallowEl()
			expect($el.find(Video)).to.be.a('Object')
	})

	it('receives the properties for the video element', function () {
		const $el = mountEl()
		const player = $el.find(Video).first()
		expect(player).to.have.prop('poster','//localhost.localdomain/img/poster.png')
		expect(player).to.have.prop('src','//localhost.localdomain/streaming/stream.mp4')
		expect(player).to.have.prop('type','video/ogg')
		expect(player).to.have.prop('controls',true)
		expect(player).to.have.prop('crossOrigin',true)
	})

	describe('#sources', () => {
		it('renders source elements', () => {
			const $el = mountEl()
			const player = $el.instance()
			expect($el).to.have.descendants('source')
		})
	})

	describe('#captions', () => {
		it('renders captions elements', () => {
			const $el = mountEl()
			const player = $el.instance()
			expect($el).to.have.descendants('track')
		})
	})
})

chai.use(chaiEnzyme())
