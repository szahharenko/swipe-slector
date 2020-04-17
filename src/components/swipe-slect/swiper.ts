import { EventMap, PointerData } from './interfaces'

class PointerEventDispatcher {
    d: PointerData = {
        startTime: 0,
        touchDuration: 0,
        xDown: 0,
        yDown: 0,
        isMouseDown: false,
        dragging: false,
        dragx: 0,
        dragy: 0,
        triggerPercent: 0.3
    }
    evtMap: EventMap = {
        TAP: [],
        SWIPE_LEFT: [],
        SWIPE_UP: [],
        SWIPE_DOWN: [],
        SWIPE_RIGHT: [],
        DRAG: [],
        MOUSEENTER: [],
        MOUSELEAVE: []
    }
    constructor(element: HTMLElement) {
        this.d.element = element
        element.addEventListener('touchstart', evt => this.handleTouchStart(evt), false)
        element.addEventListener('touchend', evt => this.handleTouchEnd(evt), false)
        element.addEventListener('mousedown', evt => this.handleMouseDown(evt), false)
        element.addEventListener('mouseup', evt => this.handleMouseUp(evt), false)
        element.addEventListener('mousemove', evt => this.handleMouseMove(evt), false)
        element.addEventListener('mouseenter', evt => this.handleMouseEnter(evt), false)
        element.addEventListener('mouseleave', evt => this.handleMouseLeave(evt), false)
    }
    public on(evt: string, cb: Function): void {
        this.evtMap[evt].push(cb)
    }
    public off(evt: string, lcb: Function): void {
        this.evtMap[evt] = this.evtMap[evt].filter((cb: any) => cb !== lcb)
    }
    public handleMouseMove(evt: MouseEvent): void {
        if (this.d.dragging && this.d.isMouseDown) {
            this.d.dragx = this.d.xDown - evt.clientX
            this.d.dragy = this.d.yDown - evt.clientY
        }
        this.triggerEvent(evt.clientX, evt.clientY)
    }    
    private trigger = (evt: string, data: any) => {
        this.evtMap[evt].map( (handler: Function) => handler(data, this.d))
    }
    private handleTouchStart = (evt: TouchEvent) => this.pointerDown(evt.touches[0].clientX, evt.touches[0].clientY)
    private handleMouseDown = (evt: MouseEvent) => this.pointerDown(evt.clientX, evt.clientY)
    private pointerDown(x: number, y: number) {
        this.d.xDown = x
        this.d.yDown = y
        this.d.dragging = true
        this.d.dragx = this.d.dragy = 0
        this.d.startTime = new Date().getTime()
        this.d.isMouseDown = true
    }
    private handleMouseUp = (evt: MouseEvent) => this.pointerUp(evt.clientX, evt.clientY)
    private handleTouchEnd = (evt: TouchEvent) => this.pointerUp(evt.touches[0].clientX, evt.touches[0].clientY)
    private pointerUp(x: number, y: number) {
        if (this.d.isMouseDown == false) return
        this.d.isMouseDown = false
        this.d.dragx = this.d.dragy = 0
        this.d.touchDuration = new Date().getTime() - this.d.startTime
        this.triggerEvent(x, y)
    }
    private handleMouseEnter = (evt: MouseEvent) => this.trigger('MOUSEENTER', evt)
    private handleMouseLeave = (evt: MouseEvent) => this.trigger('MOUSELEAVE', evt)
    private triggerEvent(x: number, y: number) {
        const deltaX = x - this.d.xDown
        const deltaY = y - this.d.yDown
        const distMoved = Math.abs(Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY)
        const elem = this.d.element as HTMLElement
        const activePct = distMoved / elem.clientWidth
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