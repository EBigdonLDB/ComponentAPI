/* Creates a custom Element Tag ProgressionBar-, which can be used as a component.*/
class ProgressionBar extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  get max() {
    return this.getAttribute('max')
  }
  set max(maxVal) {
    this.setAttribute('max', maxVal)
  }
  get current() {
    return this.getAttribute('current')
  }
  set current(currentVal) {
    this.last = this.current || 0
    setTimeout(() =>this.runProgression(), 10)
    this.setAttribute('current', currentVal)
  }
  get last() {
    return this.getAttribute('last')
  }
  set last(last) {
    this.setAttribute('last', last)
  }
  get extra() {
    return this.getAttribute('extra')
  }
  set extra(extra) {
    this.setAttribute('extra', extra)
  }
  get theme() {
    return this.getAttribute('theme')
  }
  set theme(theme) {
    this.setAttribute('theme', theme)
  }
  static get observedAttributes() {
    return ['max', 'current', 'last', 'extra', 'theme']
  }
  attributeChangedCallback(prop, oldVal, newVal) {
    this.render()
    let progress = setInterval(() => {
      let timeResult = 0
      document.querySelectorAll('tr').forEach((d, i) => {
        if (i) {
          const dates = d.querySelector('datetimepicker-')
          const timeFrom = dates.starttime.split(':')
          const timeTo = dates.endtime.split(':')
          const time =
            (Math.ceil(
              ((timeTo[0] - timeFrom[0]) * 60 + (timeTo[1] - timeFrom[1])) / 5,
            ) *
              5) /
            60
          timeResult += time
        }
      })
      if (this.current != Number(timeResult) + Number(this.extra))
        this.current = Number(timeResult) + Number(this.extra)
    }, 1000)
  }
  connectedCallback() {
    this.render()
    setTimeout(() =>this.runProgression(), 10)
  }

  runProgression() {
    const backgroundColor = this.theme == 'dark' ? '#3d3d3d' : '#ededed'
    const colors = [backgroundColor, '#08c', '#49008a', '#8a0121', '#fc053f']
    let circularProgress = this.shadow.querySelector('.circular-progress')
    let progressValue = this.shadow.querySelector('.progress-value')
    let progressStartValue = this.last > this.current ? 0 : Math.round(this.last / this.max * 100)
    let progressEndValue = (this.current / this.max) * 100
    let speed = this.last > this.current ? 5 : 60

    let progress = setInterval(() => {
      if (progressStartValue >= progressEndValue) {
        clearInterval(progress)
      } else {
          progressStartValue++
          progressValue.textContent = `${progressStartValue}%`
          circularProgress.style.background = `conic-gradient(${colors[Math.floor((progressStartValue - 1) / 100) + 1]} ${
            (progressStartValue * 3.6) > 360 ? ((progressStartValue - 1) % 100 * 3.6) : (progressStartValue * 3.6)
          }deg, ${colors[Math.floor((progressStartValue) / 100)]} 0deg)`
      }
    }, speed)
  }

  render() {
    if (
      document.location.href.includes('form') ||
      document.location.href.includes('index.html')
    ) {
      const outerDiv = document.createElement('div')
      outerDiv.setAttribute('class', 'container')
      const wrapperDiv = document.createElement('div')
      wrapperDiv.setAttribute('class', 'circular-progress')
      const valSpan = document.createElement('span')
      valSpan.setAttribute('class', 'progress-value')
      valSpan.innerHTML = '0%'
      const txtSpan = document.createElement('span')
      txtSpan.setAttribute('class', 'progress-value')
      let minutes = Math.round((this.current % 1) * 60)
      let hours =  Math.round(this.current - (this.current % 1))
      if(minutes >= 60) {
        hours += minutes / 60 - minutes / 60 % 1
        minutes = minutes % 60
      }
      const minutesMax = Math.round((this.max % 1) * 60)
      const hoursMax =  Math.round(this.max - (this.max % 1))
      txtSpan.innerHTML = `${hours}:${
        String(minutes).length > 1 ? minutes : '0' + minutes
      } / ${hoursMax}:${
        String(minutesMax).length > 1 ? minutesMax : '0' + minutesMax
      } Stunden`
      wrapperDiv.appendChild(valSpan)
      outerDiv.appendChild(wrapperDiv)
      outerDiv.appendChild(txtSpan)
      this.shadow.replaceChildren(outerDiv)
      const myStyle = document.createElement('style')
      if (this.theme == 'dark')
        myStyle.innerText = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
            .container{ display: flex; width: 420px; padding: 50px 0; border-radius: 8px; background: #212529; row-gap: 30px; flex-direction: column; align-items: center; }
            .circular-progress{ position: relative; height: 250px; width: 250px; border-radius: 50%; background: conic-gradient(#08c 3.6deg, #3d3d3d 0deg); display: flex; align-items: center; justify-content: center; }
            .circular-progress::before{ content: ""; position: absolute; height: 210px; width: 210px; border-radius: 50%; background-color: #212529; }
            .progress-value{ position: relative; font-size: 40px; font-weight: 600; color: #08c; }
            .text{ font-size: 30px; font-weight: 500; color: #606060; }`
      else
        myStyle.innerText = `
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
            .container{ display: flex; width: 420px; padding: 50px 0; border-radius: 8px; background: #fff; row-gap: 30px; flex-direction: column; align-items: center; }
            .circular-progress{ position: relative; height: 250px; width: 250px; border-radius: 50%; background: conic-gradient(#08c 3.6deg, #ededed 0deg); display: flex; align-items: center; justify-content: center; }
            .circular-progress::before{ content: ""; position: absolute; height: 210px; width: 210px; border-radius: 50%; background-color: #fff; }
            .progress-value{ position: relative; font-size: 40px; font-weight: 600; color: #08c; }
            .text{ font-size: 30px; font-weight: 500; color: #606060; }`
      this.shadow.appendChild(myStyle)
    }
  }
}
customElements.define('progressionbar-', ProgressionBar)
