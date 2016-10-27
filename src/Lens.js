class Lens { // eslint-disable-line no-unused-vars
  constructor (lensIndex, baseCurve, spherePower, diameter, minThickness) {
    if (arguments.length !== 5) {
      throw new Error(`Lens requires 5 arguments at instantiation, recieved ${arguments.length}`)
    } else if (
      typeof (lensIndex) !== 'number' ||
      typeof (baseCurve) !== 'number' ||
      typeof (spherePower) !== 'number' ||
      typeof (diameter) !== 'number' ||
      typeof (minThickness) !== 'number'
    ) {
      throw new Error('Lens requires numerical parameters at instantiation')
    }
    this.index = lensIndex
    this.blankSize = diameter
    this.baseCurve = baseCurve
    this.spherePower = spherePower
    this.minThickness = minThickness
  }
  set index (i) {
    if (typeof (i) !== 'number') {
      throw new Error('index assignment requires numerical input')
    } else if (i < 1 || i > 2) {
      throw new Error('setIndex parameter cannot be < 1 or > 2')
    } else {
      this._index = i
    }
  }
  get index () {
    return this._index
  }
  set blankSize (diameter) {
    if (typeof (diameter) !== 'number') {
      throw new Error('blank size assignment requires numerical input')
    } else if (diameter < 40 || diameter > 85) {
      throw new Error('blank size cannot be < 40 or > 85')
    } else {
      this._blankSize = diameter
    }
  }
  get blankSize () {
    return this._blankSize
  }
  set baseCurve (bc) {
    if (typeof (bc) !== 'number') {
      throw new Error('base curve assignment requires numerical input')
    } else if (bc < 0) {
      throw new Error('base curve assignment requires values >= 0')
    } else if (bc > 9) {
      throw new Error('base curve assignment requires values <= 9')
    } else {
      this._baseCurve = bc
    }
  }
  get baseCurve () {
    return this._baseCurve
  }
  set spherePower (power) {
    if (typeof (power) !== 'number') {
      throw new Error('sphere power assignment requires numerical input')
    } else if (power < -20) {
      throw new Error('sphere power assignment requires values >= -20')
    } else if (power > 20) {
      throw new Error('sphere power assignment requires values <= 20')
    } else {
      this._spherePower = power
    }
  }
  get spherePower () {
    return this._spherePower
  }
  curvatureCalc (lensIndex, power) {
    if (typeof (lensIndex) !== 'number' || typeof (power) !== 'number') {
      throw new Error(`curvatureCalc requires numerical parameters, not ${typeof lensIndex}, ${typeof power}`)
    } else if (power === 0) {
      return Infinity
    } else if (lensIndex <= 0) {
      throw new Error('index must be greater than 0')
    } else {
      return Math.abs((((lensIndex - 1) / power) * 1000))
    }
  }
  surfacePowerCalc (lensIndex, curvature) {
    if (typeof (lensIndex) !== 'number' || typeof (curvature) !== 'number') {
      throw new Error(`surfacePowerCalc requires numerical parameters, not ${typeof lensIndex}, ${typeof curvature}`)
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
      throw new Error(`sagCalc requires numerical parameters, not ${typeof curvature}, ${typeof blankDiameter}`)
    } else if (blankDiameter === 0) {
      throw new Error('sagCalc requires non-zero blank size')
    } else if (curvature === Infinity || curvature === 0) {
      return 0
    } else if (curvature <= blankDiameter / 2) {
      throw new Error('Sagitta not calculable using the supplied parameters')
    }
    var blankRadius = blankDiameter / 2
    var i = Math.pow(curvature, 2) - Math.pow(blankRadius, 2)
    var sag = curvature - Math.sqrt(i)
    return sag
  }
  get frontPower () {
    return this.surfacePowerCalc(this._index, this.curvatureCalc(1.53, this._baseCurve))
  }
  get backPower () {
    return this._spherePower - this.frontPower
  }
  get frontSag () {
    var frontCurvature = this.curvatureCalc(1.530, this.baseCurve)
    if (frontCurvature === Infinity) {
      return 0
    } else {
      return this.sagCalc(frontCurvature, this.blankSize)
    }
  }
  get backSag () {
    var backCurvature = this.curvatureCalc(this.index, this.backPower)
    return this.sagCalc(backCurvature, this.blankSize)
  }
  get maxThickness () {
    if (this.spherePower > 0) {
      // Plus lens
      return this.frontSag - this.backSag + this.minThickness
    } else {
      // Plano || minus lens
      return this.backSag - this.frontSag + this.minThickness
    }
  }
}
