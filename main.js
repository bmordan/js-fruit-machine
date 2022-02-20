class Fruit {
    constructor(imgFile, label) {
        const element = document.createElement('div')
        element.setAttribute('style', `
            background-image: url(./images/${imgFile}.png);
            background-size: cover;
            background-position: center;
            height: 105px;
            width: 105px;
            position: absolute;
            bottom: 0;
        `)
        this.el = element
        this.label = label
        this.originalPos = undefined
    }

    setPos(pos) {
        this.originalPos = this.originalPos || pos
        this.el.style.bottom = `${pos}px`
    }

    pos() {
        return Number(this.el.style.bottom.substring(0, this.el.style.bottom.length - 2))
    }

    move(delta, done) {
        setTimeout(() => {
            const nextPos = this.pos() - 3
            this.setPos(nextPos)
            return nextPos > delta ? this.move(delta, done) : done()
        }, 1)
    }
}
class Spinner {
    constructor(tumberNum) {
        this.fruits = [
            new Fruit('01', 'SEVEN'),
            new Fruit('02', 'ORANGE'),
            new Fruit('03', 'BELL'),
            new Fruit('04', 'MELLON'),
            new Fruit('05', 'LEMON'),
            new Fruit('06', 'CHERRY'),
            new Fruit('07', 'GRAPE'),
            new Fruit('08', 'BAR'),
            new Fruit('09', 'BANANA')
        ]
        this._shuffle()
        this.element = document.getElementById(`tumbler-${tumberNum}`)
        this.boundary = this.element.getBoundingClientRect().y
        this.spinning = false
        this.render()
        this.deltas = this.fruits.map(f => f.pos())
    }

    getResult() {
        return this.fruits[2].label
    }

    spin(cb) {
        if (this.spinning) return
        let spins = Math.floor(Math.random() * 6) + 10
        this._rotate(spins, cb)
    }

    render() {
        this.element.innerHTML = ""
        this.fruits.forEach((fruit, i) => {
            const pos = 105 * i
            fruit.setPos(pos - 105)
            this.element.append(fruit.el)
        })
    }

    _rotate(spins, cb) {
        let completedAnimations = []
        this.fruits.push(this.fruits.shift())
        this.fruits[this.fruits.length - 1].setPos(this.deltas[this.deltas.length - 1])
        this.fruits.forEach((fruit, index) => {
            fruit.move(this.deltas[index], () => {
                completedAnimations.push(true)
            })
        })

        const polling = setInterval(() => {
            if (completedAnimations.length === this.fruits.length) {
                clearInterval(polling)
                if (spins <= 0) {
                    this.spinning = false
                    return cb(this.fruits[2].label)
                } else {
                    this.spinning = true
                    this._rotate(--spins, cb)
                }
            }
        }, 10)
    }

    _shuffle() {
        const shuffled = []
        let n = this.fruits.length
        let i = 0
        while (n) {
            i = Math.floor(Math.random() * n--)
            shuffled.push(this.fruits.splice(i, 1)[0])
        }
        this.fruits = shuffled
    }
}

const spinner1 = new Spinner('01')
const spinner2 = new Spinner('02')
const spinner3 = new Spinner('03')

function spin() {
    const results = []
    
    setTimeout(() => {
        spinner1.spin(result => results.push(result))
    }, 110)
    setTimeout(() => {
        spinner2.spin(result => results.push(result))
    }, 100)
    setTimeout(() => {
        spinner3.spin(result => results.push(result))
    }, 80)
    
    const poll = setInterval(() => {
        if (results.length === 3) {
            clearInterval(poll)
            console.log(
                spinner1.getResult(),
                spinner2.getResult(),
                spinner3.getResult()
            )
        }
    }, 1000)
}