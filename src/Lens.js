var Lens = (() => {
  const crownGlassIndex = 1.523
  return class { // eslint-disable-line no-unused-vars
    constructor (args) {
      if (!args.minThickness) { // Provide a minimum thickness if not supplied
        args.minThickness = args.index > 1.498 ? 1.5 : 2
      }
      this._private = {}
      this.index = args.index
      this.blankSize = args.blankSize
      this.baseCurve = args.baseCurve
      this.sphere = args.sphere
      this.minThickness = args.minThickness
      if (this.frontPower < args.sphere) {
        throw new Error('Spherical power cannot exceed front surface power')
      }
    }
    set index (i) {
      if (typeof (i) !== 'number') {
        throw new Error('index assignment requires numerical input')
      } else if (i < 1.49 || i > 2) {
        throw new Error('setIndex parameter cannot be < 1.49 or > 2')
      } else {
        this._private.index = i
      }
    }
    get index () {
      return this._private.index
    }
    set blankSize (diameter) {
      if (typeof (diameter) !== 'number') {
        throw new Error('blank size assignment requires numerical input')
      } else if (diameter < 40 || diameter > 85) {
        throw new Error('blank size cannot be < 40 or > 85')
      } else {
        this._private.blankSize = diameter
      }
    }
    get blankSize () {
      return this._private.blankSize
    }
    set baseCurve (bc) {
      if (typeof (bc) !== 'number') {
        throw new Error('base curve assignment requires numerical input')
      } else if (bc < 0) {
        throw new Error('base curve assignment requires values >= 0')
      } else {
        this._private.baseCurve = bc
      }
    }
    get baseCurve () {
      return this._private.baseCurve
    }
    set sphere (power) {
      if (typeof (power) !== 'number') {
        throw new Error('sphere power assignment requires numerical input')
      } else if (power < -20) {
        throw new Error('sphere power assignment requires values >= -20')
      } else if (power > 20) {
        throw new Error('sphere power assignment requires values <= 20')
      } else {
        this._private.sphere = power
      }
    }
    get sphere () {
      return this._private.sphere
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
      } else if (curvature < blankDiameter / 2) {
        throw new Error('Sagitta not calculable: Blank radius exceeds curvature radius')
      }
      var blankRadius = blankDiameter / 2
      var i = Math.pow(curvature, 2) - Math.pow(blankRadius, 2)
      var sag = curvature - Math.sqrt(i)
      return sag
    }
    get frontPower () {
      return this.surfacePowerCalc(this._private.index, this.curvatureCalc(crownGlassIndex, this._private.baseCurve))
    }
    get backPower () {
      return this._private.sphere - this.frontPower
    }
    get frontSag () {
      var frontCurvature = this.curvatureCalc(crownGlassIndex, this.baseCurve)
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
      if (this.sphere > 0) {
        // Plus lens
        return this.frontSag - this.backSag + this.minThickness
      } else {
        // Plano || minus lens
        return this.backSag - this.frontSag + this.minThickness
      }
    }
  }
})()
