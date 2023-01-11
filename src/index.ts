let canvas:HTMLCanvasElement = document.querySelector("#canvas")

const PLAYER_SPEED = 5

class Point {
    readonly y: number;
    readonly x: number;
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }


}

class Size {

}

// const play = "34T6PkyryNpF2zLSvsqqY1iMjJCf86m6cnXXqv8bDaeZsZ9T6EZS1ficE4Q456iJSoboNuVV6skoSrYmFSV2erXr3DBaj6SDg7ptXPb616MAoHhRnEkZudLrT"
// @ts-ignore
const pickup_count = window.sfxr.generate("pickupCoin");
// @ts-ignore
const bounce = window.sfxr.toAudio("5EoyNVSymuxD8s7HP1ixqdaCn5uVGEgwQ3kJBR7bSoApFQzm7E4zZPW2EcXm3jmNdTtTPeDuvwjY8z4exqaXz3NGBHRKBx3igYfBBMRBxDALhBSvzkF6VE2Pv");
function play_bounce() {
    bounce.play()
}
// @ts-ignore
const bad_score = window.sfxr.toAudio(
    "57uBnWhGCBXZRmogjnTubrRqu8JHa4qu7bYzt4qGxEiZ59kB1ejXiyckWwdfyKVTJDgiFjZvWvrDsAkoJb2b9xzx4tzUePFTE8Q8RgkZhELcgZLkseY3SaVyh"
)

// @ts-ignore
const good_score = window.sfxr.toAudio(
    "11111BmME5aFH6T7K5CeUETxgUxj8W1oRVGSPD8gpYHs1ST93kN5kuPKoUjPn8Hesntt99rWwPTVF6TxXt1pB8ksCVgCGEv15mmD2Bf2ZYQPBZybSTNTaCsy"
)
function play_good_score() {
    good_score.play()
}

function play_bad_score() {
    bad_score.play()

}



class Bounds {
    x: number;
    y: any;
    w: any;
    h: any;
    constructor(x: number, y, w,h) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    set(number: number, number2: number, number3: number, h: number) {
        this.x = number
        this.y = number2
        this.w = number3
        this.h = h
    }

    add_self(point: Point) {
        this.x += point.x
        this.y += point.y
    }

    add(point: Point) {
        return new Bounds(this.x+point.x,this.y+point.y,this.w,this.h)
    }

    bottom() {
        return this.y + this.h
    }

    left() {
        return this.x
    }

    right() {
        return this.x + this.w
    }

    top() {
        return this.y
    }

    center() {
        return new Point(this.x+this.w/2, this.y+this.h/2)
    }
}

class Ball {
    bounds: Bounds;
    velocity: Point;
    constructor() {
        this.bounds = new Bounds(300,200,20,20)
        this.velocity = new Point(-2,2)
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'red'
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
}

class Paddle {
    bounds: Bounds;
    color: string;
    private fading: boolean;
    private fade_count:number
    constructor() {
        this.color = 'magenta'
        this.bounds = new Bounds(200,200,20,100)
        this.fading = false
        this.fade_count = 10
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color
        if(this.fading){
            let r = this.fade_count/10
            ctx.fillStyle = `rgb(${255},${r*255},${r*255})`
            this.fade_count--
            if(this.fade_count < 0)
                this.fading = false
        }
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }

    fade() {
        this.fading = true
    }
}

function rand(min: number, max: number) {
    return min + Math.random()*(max-min)
}

class FadeRect {
    bounds: Bounds;
    private fading: boolean;
    private fade_count: number;
    constructor(bounds: Bounds) {
        this.bounds = bounds
        this.fading = false
        this.fade_count = 10
    }
    draw(ctx: CanvasRenderingContext2D) {
        if(this.fading){
            let r = this.fade_count/10
            ctx.fillStyle = `rgb(${255},${r*255},${r*255})`
            this.fade_count--
            if(this.fade_count < 0)
                this.fading = false
        } else {
            ctx.fillStyle = 'rgb(50,50,50)'
        }
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
    fade() {
        this.fading = true
    }
}

class GameState {
    player: Paddle;
    computer: Paddle;
    ball: Ball;
    player_score: number;
    computer_score:number
    top_border: FadeRect;
    bot_border: FadeRect;
    playing: boolean;
    constructor() {
        this.playing = false
        this.player_score = 0
        this.computer_score = 0
        this.reset()
        this.top_border = new FadeRect(new Bounds(0,0,canvas.width,20))
        this.bot_border = new FadeRect(new Bounds(0,canvas.height-20,canvas.width,20))

    }

    reset() {
        this.player = new Paddle()
        this.player.color = 'gray'
        this.player.bounds.set(100,50,20,80)
        this.computer = new Paddle()
        this.computer.color = 'lightgray'
        this.computer.bounds.set(500,50,20,80)
        this.ball = new Ball()
        let speed = 5
        let angle = rand(0,Math.PI*2)
        this.ball.velocity = new Point(Math.sin(angle)*speed, Math.cos(angle)*speed)
    }

    draw(ctx: CanvasRenderingContext2D) {
        // console.log('drawing',ctx)
        this.top_border.draw(ctx)
        this.bot_border.draw(ctx)
        this.player.draw(ctx)
        this.computer.draw(ctx)
        this.ball.draw(ctx)

        ctx.fillStyle = 'rgb(100,100,100)'
        ctx.font = '42pt sans-serif'
        ctx.fillText(""+this.player_score,50,130)
        ctx.fillText(""+this.computer_score,550,130)

        if(!this.playing) {
            ctx.fillStyle = 'rgb(100,100,100)'
            ctx.font = '42pt sans-serif'
            ctx.fillText('click to start',180,100)
        }
    }

    start() {
        this.playing = true
    }
}

let state = new GameState()
let keystate = new Map<string,boolean>()
function init_game() {
    canvas.addEventListener('keydown',(e) => {
        keystate.set(e.code,true)
    })
    canvas.addEventListener('keyup',(e) => {
        keystate.set(e.code,false)
    })
    canvas.addEventListener('click',() => {
        state.start()
    })
    canvas.focus()
    state.reset()
}

function start() {
    init_game()
    game_loop()
}

function log(...args) {
    console.log(...args)
}

function draw_screen(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'black'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    state.draw(ctx)
}

function check_keyboard() {
    if(keystate.has('ArrowUp') && keystate.get('ArrowUp') === true) {
        let bds = state.player.bounds.add(new Point(0,-PLAYER_SPEED))
        if(bds.y >= 0) {
            state.player.bounds = bds
        }
    }
    if(keystate.has('ArrowDown') && keystate.get('ArrowDown') === true) {
        let bds = state.player.bounds.add(new Point(0,PLAYER_SPEED))
        if(bds.bottom() < canvas.height) {
            state.player.bounds = bds
        }
    }
}


function check_collisions() {
    let new_bounds = state.ball.bounds.add(state.ball.velocity)

    // player paddle
    if(new_bounds.left() <= state.player.bounds.right() && new_bounds.right() > state.player.bounds.left()) {
        if(new_bounds.bottom() > state.player.bounds.top() &&
        new_bounds.top() < state.player.bounds.bottom()) {
            state.ball.velocity = new Point(-state.ball.velocity.x, state.ball.velocity.y +  rand(-0.1,0.1))
            state.ball.bounds = state.ball.bounds.add(state.ball.velocity)
            play_bounce()
            state.player.fade()
            return
        }
    }

    //computer paddle
    if(new_bounds.right() >= state.computer.bounds.left() && new_bounds.left() < state.computer.bounds.right()) {
        if(new_bounds.bottom() > state.computer.bounds.top() &&
            new_bounds.top() < state.computer.bounds.bottom()) {
            state.ball.velocity = new Point(-state.ball.velocity.x, state.ball.velocity.y + rand(-0.1,0.1))
            state.ball.bounds = state.ball.bounds.add(state.ball.velocity)
            play_bounce()
            return
        }
    }

    if(new_bounds.bottom() > state.bot_border.bounds.top()) {
        state.ball.velocity = new Point(state.ball.velocity.x, -state.ball.velocity.y)
        state.ball.bounds = state.ball.bounds.add(state.ball.velocity)
        play_bounce()
        state.bot_border.fade()
        return
    }

    //top border
    if(new_bounds.top() < state.top_border.bounds.bottom()) {
        state.ball.velocity = new Point(state.ball.velocity.x, -state.ball.velocity.y)
        state.ball.bounds = state.ball.bounds.add(state.ball.velocity)
        play_bounce()
        state.top_border.fade()
        return
    }

    if(new_bounds.right() > canvas.width) {
        log("score against computer")
        state.player_score += 1
        state.reset()
        play_good_score()
        return
    }

    if(new_bounds.left() < 0) {
        log('score against player')
        state.computer_score += 1
        state.reset()
        play_bad_score()
        return
    }

    state.ball.bounds = new_bounds
}

function check_for_death() {

}

function move_computer() {
    let b = state.ball.bounds.center()
    let c = state.computer.bounds.center()
    if(b.y > state.computer.bounds.bottom()) {
        state.computer.bounds.add_self(new Point(0,1))
    }
    if(b.y < state.computer.bounds.top()) {
        state.computer.bounds.add_self(new Point(0,-1))
    }
}

function game_loop() {
    if(state.playing) {
        check_keyboard()
        check_collisions()
        move_computer()
        check_for_death()
    }
    let ctx:CanvasRenderingContext2D = canvas.getContext('2d')
    draw_screen(ctx)
    requestAnimationFrame(game_loop)
}

start()
