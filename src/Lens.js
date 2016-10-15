class Lens { // eslint-disable-line no-unused-vars
  constructor (lensIndex, baseCurve, power, diameter) {
    if (arguments.length !== 4) {
      throw new Error('Lens recieved too few arguments at instantiation')
    } else if (
      typeof (lensIndex) !== 'number' ||
      typeof (baseCurve) !== 'number' ||
      typeof (power) !== 'number' ||
      typeof (diameter) !== 'number'
    ) {
      throw new Error('Lens requires numerical parameters at instantiation')
    }
    this.setIndex(lensIndex)
    this.baseCurve = baseCurve
    this.power = power
    this.setBlankSize(diameter)
  }
  setIndex (newIndex) {
    if (typeof (newIndex) !== 'number') {
      throw new Error('index assignment requires numerical input')
    } else if (newIndex < 1 || newIndex > 2) {
      throw new Error('setIndex parameter cannot be < 1 or > 2')
    } else {
      this.lensIndex = newIndex
    }
  }
  setBlankSize (newDiameter) {
    if (typeof (newDiameter) !== 'number') {
      throw new Error('blank size assignment requires numerical input')
    } else if (newDiameter < 40 || newDiameter > 85) {
      throw new Error('blank size cannot be < 40 or > 85')
    } else {
      this.diameter = newDiameter
    }
  }
  curvatureCalc (lensIndex, power) {
    if (typeof (lensIndex) !== 'number' || typeof (power) !== 'number') {
      throw new Error('curvatureCalc requires numerical parameters, not ' + typeof (lensIndex) + ', ' + typeof (power))
    } else if (power === 0) {
      throw new Error('power must be non-zero')
    } else if (lensIndex <= 0) {
      throw new Error('index must be greater than 0')
    } else {
      return (((lensIndex - 1) / power) * 1000)
    }
  }
  surfacePowerCalc (lensIndex, curvature) {
    if (typeof (lensIndex) !== 'number' || typeof (curvature) !== 'number') {
      throw new Error('surfacePowerCalc requires numerical parameters, not ' + typeof (lensIndex) + ', ' + typeof (curvature))
    } else if (curvature <= 0) {
      throw new Error('surfacePowerCalc requires curvature > 0')
    } else if (lensIndex <= 0) {
      throw new Error('index must be greater than 0')
    } else {
      return (((lensIndex - 1) / curvature) * 1000)
    }
  }
  sagCalc (curvature, blankDiameter) {
    if (typeof (curvature) !== 'number' || typeof (blankDiameter) !== 'number') {
      throw new Error('sagCalc requires numerical parameters, not ' + typeof (curvature) + ', ' + typeof (blankDiameter))
    } else if (curvature === 0 || blankDiameter === 0) {
      throw new Error('sagCalc requires non-zero parameters')
    } else if (curvature <= blankDiameter / 2) {
      throw new Error('Sagitta not calculable using the supplied parameters')
    }
    var blankRadius = blankDiameter / 2
    var i = Math.pow(curvature, 2) - Math.pow(blankRadius, 2)
    var sag = curvature - Math.sqrt(i)
    console.log(sag)
    return sag
  }
  get frontPower () {
    return this.surfacePowerCalc(this.lensIndex, this.curvatureCalc(1.53, this.baseCurve))
  }
  get backPower () {
    return this.power - this.frontPower
  }
}
