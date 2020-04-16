class PointerEventDispatcher {
    constructor(element, options = {}) {
        this.evtMap = {
            TAP: [],
            SWIPE_LEFT: [],
            SWIPE_UP: [],
            SWIPE_DOWN: [],
            SWIPE_RIGHT: [],
            DRAG: [],
            MOUSEENTER: [],
            MOUSELEAVE: []
        }
        this.d = {}
        this.d.startTime = 0
        this.d.touchDuration = 0
        this.d.xDown = null
        this.d.yDown = null
        this.d.element = element
        this.d.isMouseDown = false
        this.d.dragging = false
        this.d.dragx = 0
        this.d.dragy = 0
        this.d.options = Object.assign({ triggerPercent: 0.3 }, options)

        element.addEventListener('touchstart', evt => this.handleTouchStart(evt), false)
        element.addEventListener('touchend', evt => this.handleTouchEnd(evt), false)
        element.addEventListener('mousedown', evt => this.handleMouseDown(evt), false)
        element.addEventListener('mouseup', evt => this.handleMouseUp(evt), false)
        element.addEventListener('mousemove', evt => this.handleMouseMove(evt), false)
        element.addEventListener('mouseenter', evt => this.handleMouseEnter(evt), false)
        element.addEventListener('mouseleave', evt => this.handleMouseLeave(evt), false)
    }
    uid = () => '.e' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    on(evt, cb) {
        this.evtMap[evt].push(cb)
    }
    off(evt, lcb) {
        this.evtMap[evt] = this.evtMap[evt].filter(cb => cb !== lcb)
    }
    trigger = (evt, data) => {
        this.evtMap[evt].map(handler => handler(data, this.d))
    }

    handleTouchStart = (evt) => this.pointerDown(evt.touches[0].clientX, evt.touches[0].clientY)
    handleMouseDown = (evt) => this.pointerDown(evt.clientX, evt.clientY)

    pointerDown(x, y) {
        this.d.xDown = x
        this.d.yDown = y
        this.d.dragging = true
        this.d.dragx = this.dragy = 0
        this.d.startTime = new Date().getTime()
        this.d.isMouseDown = true
    }

    handleMouseUp = (evt) => this.pointerUp(evt)
    handleTouchEnd = (evt) => this.pointerUp(evt)

    pointerUp(evt) {
        if (this.d.isMouseDown == false) return
        this.d.isMouseDown = false
        this.d.dragx = this.d.dragy = 'off'
        this.d.touchDuration = new Date().getTime() - this.d.startTime
        this.triggerEvent(evt)
    }
    handleMouseMove(evt) {
        if (this.d.dragging && this.d.isMouseDown) {
            this.d.dragx = this.d.xDown - evt.clientX
            this.d.dragy = this.d.yDown - evt.clientY
        }
        this.triggerEvent(evt)
    }

    handleMouseEnter = (evt) => this.trigger('MOUSEENTER', evt)
    handleMouseLeave = (evt) => this.trigger('MOUSELEAVE', evt)

    triggerEvent(evt) {
        const deltaX = evt.clientX - this.d.xDown
        const deltaY = evt.clientY - this.d.yDown
        const distMoved = Math.abs(Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY)
        const activePct = distMoved / this.d.element.offsetWidth
        if (this.d.dragging) {
            if (!this.d.isMouseDown) this.d.dragging = false
            this.trigger('DRAG', {
                x: this.d.dragx,
                y: this.d.dragy,
                stop: !this.d.dragging
            })
        } else {
            if (this.d.touchDuration > 250) {
                this.trigger('TAP', this.d.touchDuration)
            }
            if (activePct > this.d.triggerPercent) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    deltaX < 0 ? this.trigger('SWIPE_LEFT', distMoved) : this.trigger('SWIPE_RIGHT', distMoved)
                } else {
                    deltaY > 0 ? this.trigger('SWIPE_UP', distMoved) : this.trigger('SWIPE_DOWN', distMoved)
                }
            }
        }
    }
}

export default PointerEventDispatcher