angular.module('dataEncLib', [])

    .factory('dataEncLib',function () {

      var pidCrypt = function () {
        function e(e) {
          if (!e)e = 8;
          var t = new Array(e);
          var n = [];
          for (var r = 0; r < 256; r++)n[r] = r;
          for (r = 0; r < t.length; r++)t[r] = n[Math.floor(Math.random() * n.length)];
          return t
        }

        this.setDefaults = function () {
          this.params.nBits = 256;
          this.params.salt = e(8);
          this.params.salt = pidCryptUtil.byteArray2String(this.params.salt);
          this.params.salt = pidCryptUtil.convertToHex(this.params.salt);
          this.params.blockSize = 16;
          this.params.UTF8 = true;
          this.params.A0_PAD = true
        };
        this.debug = true;
        this.params = {};
        this.params.dataIn = "";
        this.params.dataOut = "";
        this.params.decryptIn = "";
        this.params.decryptOut = "";
        this.params.encryptIn = "";
        this.params.encryptOut = "";
        this.params.key = "";
        this.params.iv = "";
        this.params.clear = true;
        this.setDefaults();
        this.errors = "";
        this.warnings = "";
        this.infos = "";
        this.debugMsg = "";
        this.setParams = function (e) {
          if (!e)e = {};
          for (var t in e)this.params[t] = e[t]
        };
        this.getParams = function () {
          return this.params
        };
        this.getParam = function (e) {
          return this.params[e] || ""
        };
        this.clearParams = function () {
          this.params = {}
        };
        this.getNBits = function () {
          return this.params.nBits
        };
        this.getOutput = function () {
          return this.params.dataOut
        };
        this.setError = function (e) {
          this.error = e
        };
        this.appendError = function (e) {
          this.errors += e;
          return ""
        };
        this.getErrors = function () {
          return this.errors
        };
        this.isError = function () {
          if (this.errors.length > 0)return true;
          return false
        };
        this.appendInfo = function (e) {
          this.infos += e;
          return ""
        };
        this.getInfos = function () {
          return this.infos
        };
        this.setDebug = function (e) {
          this.debug = e
        };
        this.appendDebug = function (e) {
          this.debugMsg += e;
          return ""
        };
        this.isDebug = function () {
          return this.debug
        };
        this.getAllMessages = function (e) {
          var t = {lf: "\n", clr_mes: false, verbose: 15};
          if (!e)e = t;
          for (var n in t)if (typeof e[n] == "undefined")e[n] = t[n];
          var r = "";
          var i = "";
          for (var s in this.params) {
            switch (s) {
              case"encryptOut":
                i = pidCryptUtil.toByteArray(this.params[s].toString());
                i = pidCryptUtil.fragment(i.join(), 64, e.lf);
                break;
              case"key":
              case"iv":
                i = pidCryptUtil.formatHex(this.params[s], 48);
                break;
              default:
                i = pidCryptUtil.fragment(this.params[s].toString(), 64, e.lf)
            }
            r += "<p><b>" + s + "</b>:<pre>" + i + "</pre></p>"
          }
          if (this.debug)r += "debug: " + this.debug + e.lf;
          if (this.errors.length > 0 && (e.verbose & 1) == 1)r += "Errors:" + e.lf + this.errors + e.lf;
          if (this.warnings.length > 0 && (e.verbose & 2) == 2)r += "Warnings:" + e.lf + this.warnings + e.lf;
          if (this.infos.length > 0 && (e.verbose & 4) == 4)r += "Infos:" + e.lf + this.infos + e.lf;
          if (this.debug && (e.verbose & 8) == 8)r += "Debug messages:" + e.lf + this.debugMsg + e.lf;
          if (e.clr_mes)this.errors = this.infos = this.warnings = this.debug = "";
          return r
        };
        this.getRandomBytes = function (t) {
          return e(t)
        }
      }

      function Stream(e, t) {
        if (e instanceof Stream) {
          this.enc = e.enc;
          this.pos = e.pos
        } else {
          this.enc = e;
          this.pos = t
        }
      }

      function BigInteger(e, t, n) {
        if (e != null)if ("number" == typeof e)this.fromNumber(e, t, n); else if (t == null && "string" != typeof e)this.fromString(e, 256); else this.fromString(e, t)
      }

      function nbi() {
        return new BigInteger(null)
      }

      function am1(e, t, n, r, i, s) {
        while (--s >= 0) {
          var o = t * this[e++] + n[r] + i;
          i = Math.floor(o / 67108864);
          n[r++] = o & 67108863
        }
        return i
      }

      function am2(e, t, n, r, i, s) {
        var o = t & 32767, u = t >> 15;
        while (--s >= 0) {
          var a = this[e] & 32767;
          var f = this[e++] >> 15;
          var l = u * a + f * o;
          a = o * a + ((l & 32767) << 15) + n[r] + (i & 1073741823);
          i = (a >>> 30) + (l >>> 15) + u * f + (i >>> 30);
          n[r++] = a & 1073741823
        }
        return i
      }

      function am3(e, t, n, r, i, s) {
        var o = t & 16383, u = t >> 14;
        while (--s >= 0) {
          var a = this[e] & 16383;
          var f = this[e++] >> 14;
          var l = u * a + f * o;
          a = o * a + ((l & 16383) << 14) + n[r] + i;
          i = (a >> 28) + (l >> 14) + u * f;
          n[r++] = a & 268435455
        }
        return i
      }

      function int2char(e) {
        return BI_RM.charAt(e)
      }

      function intAt(e, t) {
        var n = BI_RC[e.charCodeAt(t)];
        return n == null ? -1 : n
      }

      function bnpCopyTo(e) {
        for (var t = this.t - 1; t >= 0; --t)e[t] = this[t];
        e.t = this.t;
        e.s = this.s
      }

      function bnpFromInt(e) {
        this.t = 1;
        this.s = e < 0 ? -1 : 0;
        if (e > 0)this[0] = e; else if (e < -1)this[0] = e + DV; else this.t = 0
      }

      function nbv(e) {
        var t = nbi();
        t.fromInt(e);
        return t
      }

      function bnpFromString(e, t) {
        var n;
        if (t == 16)n = 4; else if (t == 8)n = 3; else if (t == 256)n = 8; else if (t == 2)n = 1; else if (t == 32)n = 5; else if (t == 4)n = 2; else {
          this.fromRadix(e, t);
          return
        }
        this.t = 0;
        this.s = 0;
        var r = e.length, i = false, s = 0;
        while (--r >= 0) {
          var o = n == 8 ? e[r] & 255 : intAt(e, r);
          if (o < 0) {
            if (e.charAt(r) == "-")i = true;
            continue
          }
          i = false;
          if (s == 0)this[this.t++] = o; else if (s + n > this.DB) {
            this[this.t - 1] |= (o & (1 << this.DB - s) - 1) << s;
            this[this.t++] = o >> this.DB - s
          } else this[this.t - 1] |= o << s;
          s += n;
          if (s >= this.DB)s -= this.DB
        }
        if (n == 8 && (e[0] & 128) != 0) {
          this.s = -1;
          if (s > 0)this[this.t - 1] |= (1 << this.DB - s) - 1 << s
        }
        this.clamp();
        if (i)BigInteger.ZERO.subTo(this, this)
      }

      function bnpClamp() {
        var e = this.s & this.DM;
        while (this.t > 0 && this[this.t - 1] == e)--this.t
      }

      function bnToString(e) {
        if (this.s < 0)return "-" + this.negate().toString(e);
        var t;
        if (e == 16)t = 4; else if (e == 8)t = 3; else if (e == 2)t = 1; else if (e == 32)t = 5; else if (e == 4)t = 2; else return this.toRadix(e);
        var n = (1 << t) - 1, r, i = false, s = "", o = this.t;
        var u = this.DB - o * this.DB % t;
        if (o-- > 0) {
          if (u < this.DB && (r = this[o] >> u) > 0) {
            i = true;
            s = int2char(r)
          }
          while (o >= 0) {
            if (u < t) {
              r = (this[o] & (1 << u) - 1) << t - u;
              r |= this[--o] >> (u += this.DB - t)
            } else {
              r = this[o] >> (u -= t) & n;
              if (u <= 0) {
                u += this.DB;
                --o
              }
            }
            if (r > 0)i = true;
            if (i)s += int2char(r)
          }
        }
        return i ? s : "0"
      }

      function bnNegate() {
        var e = nbi();
        BigInteger.ZERO.subTo(this, e);
        return e
      }

      function bnAbs() {
        return this.s < 0 ? this.negate() : this
      }

      function bnCompareTo(e) {
        var t = this.s - e.s;
        if (t != 0)return t;
        var n = this.t;
        t = n - e.t;
        if (t != 0)return t;
        while (--n >= 0)if ((t = this[n] - e[n]) != 0)return t;
        return 0
      }

      function nbits(e) {
        var t = 1, n;
        if ((n = e >>> 16) != 0) {
          e = n;
          t += 16
        }
        if ((n = e >> 8) != 0) {
          e = n;
          t += 8
        }
        if ((n = e >> 4) != 0) {
          e = n;
          t += 4
        }
        if ((n = e >> 2) != 0) {
          e = n;
          t += 2
        }
        if ((n = e >> 1) != 0) {
          e = n;
          t += 1
        }
        return t
      }

      function bnBitLength() {
        if (this.t <= 0)return 0;
        return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM)
      }

      function bnpDLShiftTo(e, t) {
        var n;
        for (n = this.t - 1; n >= 0; --n)t[n + e] = this[n];
        for (n = e - 1; n >= 0; --n)t[n] = 0;
        t.t = this.t + e;
        t.s = this.s
      }

      function bnpDRShiftTo(e, t) {
        for (var n = e; n < this.t; ++n)t[n - e] = this[n];
        t.t = Math.max(this.t - e, 0);
        t.s = this.s
      }

      function bnpLShiftTo(e, t) {
        var n = e % this.DB;
        var r = this.DB - n;
        var i = (1 << r) - 1;
        var s = Math.floor(e / this.DB), o = this.s << n & this.DM, u;
        for (u = this.t - 1; u >= 0; --u) {
          t[u + s + 1] = this[u] >> r | o;
          o = (this[u] & i) << n
        }
        for (u = s - 1; u >= 0; --u)t[u] = 0;
        t[s] = o;
        t.t = this.t + s + 1;
        t.s = this.s;
        t.clamp()
      }

      function bnpRShiftTo(e, t) {
        t.s = this.s;
        var n = Math.floor(e / this.DB);
        if (n >= this.t) {
          t.t = 0;
          return
        }
        var r = e % this.DB;
        var i = this.DB - r;
        var s = (1 << r) - 1;
        t[0] = this[n] >> r;
        for (var o = n + 1; o < this.t; ++o) {
          t[o - n - 1] |= (this[o] & s) << i;
          t[o - n] = this[o] >> r
        }
        if (r > 0)t[this.t - n - 1] |= (this.s & s) << i;
        t.t = this.t - n;
        t.clamp()
      }

      function bnpSubTo(e, t) {
        var n = 0, r = 0, i = Math.min(e.t, this.t);
        while (n < i) {
          r += this[n] - e[n];
          t[n++] = r & this.DM;
          r >>= this.DB
        }
        if (e.t < this.t) {
          r -= e.s;
          while (n < this.t) {
            r += this[n];
            t[n++] = r & this.DM;
            r >>= this.DB
          }
          r += this.s
        } else {
          r += this.s;
          while (n < e.t) {
            r -= e[n];
            t[n++] = r & this.DM;
            r >>= this.DB
          }
          r -= e.s
        }
        t.s = r < 0 ? -1 : 0;
        if (r < -1)t[n++] = this.DV + r; else if (r > 0)t[n++] = r;
        t.t = n;
        t.clamp()
      }

      function bnpMultiplyTo(e, t) {
        var n = this.abs(), r = e.abs();
        var i = n.t;
        t.t = i + r.t;
        while (--i >= 0)t[i] = 0;
        for (i = 0; i < r.t; ++i)t[i + n.t] = n.am(0, r[i], t, i, 0, n.t);
        t.s = 0;
        t.clamp();
        if (this.s != e.s)BigInteger.ZERO.subTo(t, t)
      }

      function bnpSquareTo(e) {
        var t = this.abs();
        var n = e.t = 2 * t.t;
        while (--n >= 0)e[n] = 0;
        for (n = 0; n < t.t - 1; ++n) {
          var r = t.am(n, t[n], e, 2 * n, 0, 1);
          if ((e[n + t.t] += t.am(n + 1, 2 * t[n], e, 2 * n + 1, r, t.t - n - 1)) >= t.DV) {
            e[n + t.t] -= t.DV;
            e[n + t.t + 1] = 1
          }
        }
        if (e.t > 0)e[e.t - 1] += t.am(n, t[n], e, 2 * n, 0, 1);
        e.s = 0;
        e.clamp()
      }

      function bnpDivRemTo(e, t, n) {
        var r = e.abs();
        if (r.t <= 0)return;
        var i = this.abs();
        if (i.t < r.t) {
          if (t != null)t.fromInt(0);
          if (n != null)this.copyTo(n);
          return
        }
        if (n == null)n = nbi();
        var s = nbi(), o = this.s, u = e.s;
        var a = this.DB - nbits(r[r.t - 1]);
        if (a > 0) {
          r.lShiftTo(a, s);
          i.lShiftTo(a, n)
        } else {
          r.copyTo(s);
          i.copyTo(n)
        }
        var f = s.t;
        var l = s[f - 1];
        if (l == 0)return;
        var c = l * (1 << this.F1) + (f > 1 ? s[f - 2] >> this.F2 : 0);
        var h = this.FV / c, p = (1 << this.F1) / c, d = 1 << this.F2;
        var v = n.t, m = v - f, g = t == null ? nbi() : t;
        s.dlShiftTo(m, g);
        if (n.compareTo(g) >= 0) {
          n[n.t++] = 1;
          n.subTo(g, n)
        }
        BigInteger.ONE.dlShiftTo(f, g);
        g.subTo(s, s);
        while (s.t < f)s[s.t++] = 0;
        while (--m >= 0) {
          var y = n[--v] == l ? this.DM : Math.floor(n[v] * h + (n[v - 1] + d) * p);
          if ((n[v] += s.am(0, y, n, m, 0, f)) < y) {
            s.dlShiftTo(m, g);
            n.subTo(g, n);
            while (n[v] < --y)n.subTo(g, n)
          }
        }
        if (t != null) {
          n.drShiftTo(f, t);
          if (o != u)BigInteger.ZERO.subTo(t, t)
        }
        n.t = f;
        n.clamp();
        if (a > 0)n.rShiftTo(a, n);
        if (o < 0)BigInteger.ZERO.subTo(n, n)
      }

      function bnMod(e) {
        var t = nbi();
        this.abs().divRemTo(e, null, t);
        if (this.s < 0 && t.compareTo(BigInteger.ZERO) > 0)e.subTo(t, t);
        return t
      }

      function Classic(e) {
        this.m = e
      }

      function cConvert(e) {
        if (e.s < 0 || e.compareTo(this.m) >= 0)return e.mod(this.m); else return e
      }

      function cRevert(e) {
        return e
      }

      function cReduce(e) {
        e.divRemTo(this.m, null, e)
      }

      function cMulTo(e, t, n) {
        e.multiplyTo(t, n);
        this.reduce(n)
      }

      function cSqrTo(e, t) {
        e.squareTo(t);
        this.reduce(t)
      }

      function bnpInvDigit() {
        if (this.t < 1)return 0;
        var e = this[0];
        if ((e & 1) == 0)return 0;
        var t = e & 3;
        t = t * (2 - (e & 15) * t) & 15;
        t = t * (2 - (e & 255) * t) & 255;
        t = t * (2 - ((e & 65535) * t & 65535)) & 65535;
        t = t * (2 - e * t % this.DV) % this.DV;
        return t > 0 ? this.DV - t : -t
      }

      function Montgomery(e) {
        this.m = e;
        this.mp = e.invDigit();
        this.mpl = this.mp & 32767;
        this.mph = this.mp >> 15;
        this.um = (1 << e.DB - 15) - 1;
        this.mt2 = 2 * e.t
      }

      function montConvert(e) {
        var t = nbi();
        e.abs().dlShiftTo(this.m.t, t);
        t.divRemTo(this.m, null, t);
        if (e.s < 0 && t.compareTo(BigInteger.ZERO) > 0)this.m.subTo(t, t);
        return t
      }

      function montRevert(e) {
        var t = nbi();
        e.copyTo(t);
        this.reduce(t);
        return t
      }

      function montReduce(e) {
        while (e.t <= this.mt2)e[e.t++] = 0;
        for (var t = 0; t < this.m.t; ++t) {
          var n = e[t] & 32767;
          var r = n * this.mpl + ((n * this.mph + (e[t] >> 15) * this.mpl & this.um) << 15) & e.DM;
          n = t + this.m.t;
          e[n] += this.m.am(0, r, e, t, 0, this.m.t);
          while (e[n] >= e.DV) {
            e[n] -= e.DV;
            e[++n]++
          }
        }
        e.clamp();
        e.drShiftTo(this.m.t, e);
        if (e.compareTo(this.m) >= 0)e.subTo(this.m, e)
      }

      function montSqrTo(e, t) {
        e.squareTo(t);
        this.reduce(t)
      }

      function montMulTo(e, t, n) {
        e.multiplyTo(t, n);
        this.reduce(n)
      }

      function bnpIsEven() {
        return (this.t > 0 ? this[0] & 1 : this.s) == 0
      }

      function bnpExp(e, t) {
        if (e > 4294967295 || e < 1)return BigInteger.ONE;
        var n = nbi(), r = nbi(), i = t.convert(this), s = nbits(e) - 1;
        i.copyTo(n);
        while (--s >= 0) {
          t.sqrTo(n, r);
          if ((e & 1 << s) > 0)t.mulTo(r, i, n); else {
            var o = n;
            n = r;
            r = o
          }
        }
        return t.revert(n)
      }

      function bnModPowInt(e, t) {
        var n;
        if (e < 256 || t.isEven())n = new Classic(t); else n = new Montgomery(t);
        return this.exp(e, n)
      }

      function bnClone() {
        var e = nbi();
        this.copyTo(e);
        return e
      }

      function bnIntValue() {
        if (this.s < 0) {
          if (this.t == 1)return this[0] - this.DV; else if (this.t == 0)return -1
        } else if (this.t == 1)return this[0]; else if (this.t == 0)return 0;
        return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0]
      }

      function bnByteValue() {
        return this.t == 0 ? this.s : this[0] << 24 >> 24
      }

      function bnShortValue() {
        return this.t == 0 ? this.s : this[0] << 16 >> 16
      }

      function bnpChunkSize(e) {
        return Math.floor(Math.LN2 * this.DB / Math.log(e))
      }

      function bnSigNum() {
        if (this.s < 0)return -1; else if (this.t <= 0 || this.t == 1 && this[0] <= 0)return 0; else return 1
      }

      function bnpToRadix(e) {
        if (e == null)e = 10;
        if (this.signum() == 0 || e < 2 || e > 36)return "0";
        var t = this.chunkSize(e);
        var n = Math.pow(e, t);
        var r = nbv(n), i = nbi(), s = nbi(), o = "";
        this.divRemTo(r, i, s);
        while (i.signum() > 0) {
          o = (n + s.intValue()).toString(e).substr(1) + o;
          i.divRemTo(r, i, s)
        }
        return s.intValue().toString(e) + o
      }

      function bnpFromRadix(e, t) {
        this.fromInt(0);
        if (t == null)t = 10;
        var n = this.chunkSize(t);
        var r = Math.pow(t, n), i = false, s = 0, o = 0;
        for (var u = 0; u < e.length; ++u) {
          var a = intAt(e, u);
          if (a < 0) {
            if (e.charAt(u) == "-" && this.signum() == 0)i = true;
            continue
          }
          o = t * o + a;
          if (++s >= n) {
            this.dMultiply(r);
            this.dAddOffset(o, 0);
            s = 0;
            o = 0
          }
        }
        if (s > 0) {
          this.dMultiply(Math.pow(t, s));
          this.dAddOffset(o, 0)
        }
        if (i)BigInteger.ZERO.subTo(this, this)
      }

      function bnpFromNumber(e, t, n) {
        if ("number" == typeof t) {
          if (e < 2)this.fromInt(1); else {
            this.fromNumber(e, n);
            if (!this.testBit(e - 1))this.bitwiseTo(BigInteger.ONE.shiftLeft(e - 1), op_or, this);
            if (this.isEven())this.dAddOffset(1, 0);
            while (!this.isProbablePrime(t)) {
              this.dAddOffset(2, 0);
              if (this.bitLength() > e)this.subTo(BigInteger.ONE.shiftLeft(e - 1), this)
            }
          }
        } else {
          var r = new Array, i = e & 7;
          r.length = (e >> 3) + 1;
          t.nextBytes(r);
          if (i > 0)r[0] &= (1 << i) - 1; else r[0] = 0;
          this.fromString(r, 256)
        }
      }

      function bnToByteArray() {
        var e = this.t, t = new Array;
        t[0] = this.s;
        var n = this.DB - e * this.DB % 8, r, i = 0;
        if (e-- > 0) {
          if (n < this.DB && (r = this[e] >> n) != (this.s & this.DM) >> n)t[i++] = r | this.s << this.DB - n;
          while (e >= 0) {
            if (n < 8) {
              r = (this[e] & (1 << n) - 1) << 8 - n;
              r |= this[--e] >> (n += this.DB - 8)
            } else {
              r = this[e] >> (n -= 8) & 255;
              if (n <= 0) {
                n += this.DB;
                --e
              }
            }
            if ((r & 128) != 0)r |= -256;
            if (i == 0 && (this.s & 128) != (r & 128))++i;
            if (i > 0 || r != this.s)t[i++] = r
          }
        }
        return t
      }

      function bnEquals(e) {
        return this.compareTo(e) == 0
      }

      function bnMin(e) {
        return this.compareTo(e) < 0 ? this : e
      }

      function bnMax(e) {
        return this.compareTo(e) > 0 ? this : e
      }

      function bnpBitwiseTo(e, t, n) {
        var r, i, s = Math.min(e.t, this.t);
        for (r = 0; r < s; ++r)n[r] = t(this[r], e[r]);
        if (e.t < this.t) {
          i = e.s & this.DM;
          for (r = s; r < this.t; ++r)n[r] = t(this[r], i);
          n.t = this.t
        } else {
          i = this.s & this.DM;
          for (r = s; r < e.t; ++r)n[r] = t(i, e[r]);
          n.t = e.t
        }
        n.s = t(this.s, e.s);
        n.clamp()
      }

      function op_and(e, t) {
        return e & t
      }

      function bnAnd(e) {
        var t = nbi();
        this.bitwiseTo(e, op_and, t);
        return t
      }

      function op_or(e, t) {
        return e | t
      }

      function bnOr(e) {
        var t = nbi();
        this.bitwiseTo(e, op_or, t);
        return t
      }

      function op_xor(e, t) {
        return e ^ t
      }

      function bnXor(e) {
        var t = nbi();
        this.bitwiseTo(e, op_xor, t);
        return t
      }

      function op_andnot(e, t) {
        return e & ~t
      }

      function bnAndNot(e) {
        var t = nbi();
        this.bitwiseTo(e, op_andnot, t);
        return t
      }

      function bnNot() {
        var e = nbi();
        for (var t = 0; t < this.t; ++t)e[t] = this.DM & ~this[t];
        e.t = this.t;
        e.s = ~this.s;
        return e
      }

      function bnShiftLeft(e) {
        var t = nbi();
        if (e < 0)this.rShiftTo(-e, t); else this.lShiftTo(e, t);
        return t
      }

      function bnShiftRight(e) {
        var t = nbi();
        if (e < 0)this.lShiftTo(-e, t); else this.rShiftTo(e, t);
        return t
      }

      function lbit(e) {
        if (e == 0)return -1;
        var t = 0;
        if ((e & 65535) == 0) {
          e >>= 16;
          t += 16
        }
        if ((e & 255) == 0) {
          e >>= 8;
          t += 8
        }
        if ((e & 15) == 0) {
          e >>= 4;
          t += 4
        }
        if ((e & 3) == 0) {
          e >>= 2;
          t += 2
        }
        if ((e & 1) == 0)++t;
        return t
      }

      function bnGetLowestSetBit() {
        for (var e = 0; e < this.t; ++e)if (this[e] != 0)return e * this.DB + lbit(this[e]);
        if (this.s < 0)return this.t * this.DB;
        return -1
      }

      function cbit(e) {
        var t = 0;
        while (e != 0) {
          e &= e - 1;
          ++t
        }
        return t
      }

      function bnBitCount() {
        var e = 0, t = this.s & this.DM;
        for (var n = 0; n < this.t; ++n)e += cbit(this[n] ^ t);
        return e
      }

      function bnTestBit(e) {
        var t = Math.floor(e / this.DB);
        if (t >= this.t)return this.s != 0;
        return (this[t] & 1 << e % this.DB) != 0
      }

      function bnpChangeBit(e, t) {
        var n = BigInteger.ONE.shiftLeft(e);
        this.bitwiseTo(n, t, n);
        return n
      }

      function bnSetBit(e) {
        return this.changeBit(e, op_or)
      }

      function bnClearBit(e) {
        return this.changeBit(e, op_andnot)
      }

      function bnFlipBit(e) {
        return this.changeBit(e, op_xor)
      }

      function bnpAddTo(e, t) {
        var n = 0, r = 0, i = Math.min(e.t, this.t);
        while (n < i) {
          r += this[n] + e[n];
          t[n++] = r & this.DM;
          r >>= this.DB
        }
        if (e.t < this.t) {
          r += e.s;
          while (n < this.t) {
            r += this[n];
            t[n++] = r & this.DM;
            r >>= this.DB
          }
          r += this.s
        } else {
          r += this.s;
          while (n < e.t) {
            r += e[n];
            t[n++] = r & this.DM;
            r >>= this.DB
          }
          r += e.s
        }
        t.s = r < 0 ? -1 : 0;
        if (r > 0)t[n++] = r; else if (r < -1)t[n++] = this.DV + r;
        t.t = n;
        t.clamp()
      }

      function bnAdd(e) {
        var t = nbi();
        this.addTo(e, t);
        return t
      }

      function bnSubtract(e) {
        var t = nbi();
        this.subTo(e, t);
        return t
      }

      function bnMultiply(e) {
        var t = nbi();
        this.multiplyTo(e, t);
        return t
      }

      function bnDivide(e) {
        var t = nbi();
        this.divRemTo(e, t, null);
        return t
      }

      function bnRemainder(e) {
        var t = nbi();
        this.divRemTo(e, null, t);
        return t
      }

      function bnDivideAndRemainder(e) {
        var t = nbi(), n = nbi();
        this.divRemTo(e, t, n);
        return new Array(t, n)
      }

      function bnpDMultiply(e) {
        this[this.t] = this.am(0, e - 1, this, 0, 0, this.t);
        ++this.t;
        this.clamp()
      }

      function bnpDAddOffset(e, t) {
        while (this.t <= t)this[this.t++] = 0;
        this[t] += e;
        while (this[t] >= this.DV) {
          this[t] -= this.DV;
          if (++t >= this.t)this[this.t++] = 0;
          ++this[t]
        }
      }

      function NullExp() {
      }

      function nNop(e) {
        return e
      }

      function nMulTo(e, t, n) {
        e.multiplyTo(t, n)
      }

      function nSqrTo(e, t) {
        e.squareTo(t)
      }

      function bnPow(e) {
        return this.exp(e, new NullExp)
      }

      function bnpMultiplyLowerTo(e, t, n) {
        var r = Math.min(this.t + e.t, t);
        n.s = 0;
        n.t = r;
        while (r > 0)n[--r] = 0;
        var i;
        for (i = n.t - this.t; r < i; ++r)n[r + this.t] = this.am(0, e[r], n, r, 0, this.t);
        for (i = Math.min(e.t, t); r < i; ++r)this.am(0, e[r], n, r, 0, t - r);
        n.clamp()
      }

      function bnpMultiplyUpperTo(e, t, n) {
        --t;
        var r = n.t = this.t + e.t - t;
        n.s = 0;
        while (--r >= 0)n[r] = 0;
        for (r = Math.max(t - this.t, 0); r < e.t; ++r)n[this.t + r - t] = this.am(t - r, e[r], n, 0, 0, this.t + r - t);
        n.clamp();
        n.drShiftTo(1, n)
      }

      function Barrett(e) {
        this.r2 = nbi();
        this.q3 = nbi();
        BigInteger.ONE.dlShiftTo(2 * e.t, this.r2);
        this.mu = this.r2.divide(e);
        this.m = e
      }

      function barrettConvert(e) {
        if (e.s < 0 || e.t > 2 * this.m.t)return e.mod(this.m); else if (e.compareTo(this.m) < 0)return e; else {
          var t = nbi();
          e.copyTo(t);
          this.reduce(t);
          return t
        }
      }

      function barrettRevert(e) {
        return e
      }

      function barrettReduce(e) {
        e.drShiftTo(this.m.t - 1, this.r2);
        if (e.t > this.m.t + 1) {
          e.t = this.m.t + 1;
          e.clamp()
        }
        this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
        this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
        while (e.compareTo(this.r2) < 0)e.dAddOffset(1, this.m.t + 1);
        e.subTo(this.r2, e);
        while (e.compareTo(this.m) >= 0)e.subTo(this.m, e)
      }

      function barrettSqrTo(e, t) {
        e.squareTo(t);
        this.reduce(t)
      }

      function barrettMulTo(e, t, n) {
        e.multiplyTo(t, n);
        this.reduce(n)
      }

      function bnModPow(e, t) {
        var n = e.bitLength(), r, i = nbv(1), s;
        if (n <= 0)return i; else if (n < 18)r = 1; else if (n < 48)r = 3; else if (n < 144)r = 4; else if (n < 768)r = 5; else r = 6;
        if (n < 8)s = new Classic(t); else if (t.isEven())s = new Barrett(t); else s = new Montgomery(t);
        var o = new Array, u = 3, a = r - 1, f = (1 << r) - 1;
        o[1] = s.convert(this);
        if (r > 1) {
          var l = nbi();
          s.sqrTo(o[1], l);
          while (u <= f) {
            o[u] = nbi();
            s.mulTo(l, o[u - 2], o[u]);
            u += 2
          }
        }
        var c = e.t - 1, h, p = true, d = nbi(), v;
        n = nbits(e[c]) - 1;
        while (c >= 0) {
          if (n >= a)h = e[c] >> n - a & f; else {
            h = (e[c] & (1 << n + 1) - 1) << a - n;
            if (c > 0)h |= e[c - 1] >> this.DB + n - a
          }
          u = r;
          while ((h & 1) == 0) {
            h >>= 1;
            --u
          }
          if ((n -= u) < 0) {
            n += this.DB;
            --c
          }
          if (p) {
            o[h].copyTo(i);
            p = false
          } else {
            while (u > 1) {
              s.sqrTo(i, d);
              s.sqrTo(d, i);
              u -= 2
            }
            if (u > 0)s.sqrTo(i, d); else {
              v = i;
              i = d;
              d = v
            }
            s.mulTo(d, o[h], i)
          }
          while (c >= 0 && (e[c] & 1 << n) == 0) {
            s.sqrTo(i, d);
            v = i;
            i = d;
            d = v;
            if (--n < 0) {
              n = this.DB - 1;
              --c
            }
          }
        }
        return s.revert(i)
      }

      function bnGCD(e) {
        var t = this.s < 0 ? this.negate() : this.clone();
        var n = e.s < 0 ? e.negate() : e.clone();
        if (t.compareTo(n) < 0) {
          var r = t;
          t = n;
          n = r
        }
        var i = t.getLowestSetBit(), s = n.getLowestSetBit();
        if (s < 0)return t;
        if (i < s)s = i;
        if (s > 0) {
          t.rShiftTo(s, t);
          n.rShiftTo(s, n)
        }
        while (t.signum() > 0) {
          if ((i = t.getLowestSetBit()) > 0)t.rShiftTo(i, t);
          if ((i = n.getLowestSetBit()) > 0)n.rShiftTo(i, n);
          if (t.compareTo(n) >= 0) {
            t.subTo(n, t);
            t.rShiftTo(1, t)
          } else {
            n.subTo(t, n);
            n.rShiftTo(1, n)
          }
        }
        if (s > 0)n.lShiftTo(s, n);
        return n
      }

      function bnpModInt(e) {
        if (e <= 0)return 0;
        var t = this.DV % e, n = this.s < 0 ? e - 1 : 0;
        if (this.t > 0)if (t == 0)n = this[0] % e; else for (var r = this.t - 1; r >= 0; --r)n = (t * n + this[r]) % e;
        return n
      }

      function bnModInverse(e) {
        var t = e.isEven();
        if (this.isEven() && t || e.signum() == 0)return BigInteger.ZERO;
        var n = e.clone(), r = this.clone();
        var i = nbv(1), s = nbv(0), o = nbv(0), u = nbv(1);
        while (n.signum() != 0) {
          while (n.isEven()) {
            n.rShiftTo(1, n);
            if (t) {
              if (!i.isEven() || !s.isEven()) {
                i.addTo(this, i);
                s.subTo(e, s)
              }
              i.rShiftTo(1, i)
            } else if (!s.isEven())s.subTo(e, s);
            s.rShiftTo(1, s)
          }
          while (r.isEven()) {
            r.rShiftTo(1, r);
            if (t) {
              if (!o.isEven() || !u.isEven()) {
                o.addTo(this, o);
                u.subTo(e, u)
              }
              o.rShiftTo(1, o)
            } else if (!u.isEven())u.subTo(e, u);
            u.rShiftTo(1, u)
          }
          if (n.compareTo(r) >= 0) {
            n.subTo(r, n);
            if (t)i.subTo(o, i);
            s.subTo(u, s)
          } else {
            r.subTo(n, r);
            if (t)o.subTo(i, o);
            u.subTo(s, u)
          }
        }
        if (r.compareTo(BigInteger.ONE) != 0)return BigInteger.ZERO;
        if (u.compareTo(e) >= 0)return u.subtract(e);
        if (u.signum() < 0)u.addTo(e, u); else return u;
        if (u.signum() < 0)return u.add(e); else return u
      }

      function bnIsProbablePrime(e) {
        var t, n = this.abs();
        if (n.t == 1 && n[0] <= lowprimes[lowprimes.length - 1]) {
          for (t = 0; t < lowprimes.length; ++t)if (n[0] == lowprimes[t])return true;
          return false
        }
        if (n.isEven())return false;
        t = 1;
        while (t < lowprimes.length) {
          var r = lowprimes[t], i = t + 1;
          while (i < lowprimes.length && r < lplim)r *= lowprimes[i++];
          r = n.modInt(r);
          while (t < i)if (r % lowprimes[t++] == 0)return false
        }
        return n.millerRabin(e)
      }

      function bnpMillerRabin(e) {
        var t = this.subtract(BigInteger.ONE);
        var n = t.getLowestSetBit();
        if (n <= 0)return false;
        var r = t.shiftRight(n);
        e = e + 1 >> 1;
        if (e > lowprimes.length)e = lowprimes.length;
        var i = nbi();
        for (var s = 0; s < e; ++s) {
          i.fromInt(lowprimes[s]);
          var o = i.modPow(r, this);
          if (o.compareTo(BigInteger.ONE) != 0 && o.compareTo(t) != 0) {
            var u = 1;
            while (u++ < n && o.compareTo(t) != 0) {
              o = o.modPowInt(2, this);
              if (o.compareTo(BigInteger.ONE) == 0)return false
            }
            if (o.compareTo(t) != 0)return false
          }
        }
        return true
      }

      function SecureRandom() {
        this.rng_state;
        this.rng_pool;
        this.rng_pptr;
        this.rng_seed_int = function (e) {
          this.rng_pool[this.rng_pptr++] ^= e & 255;
          this.rng_pool[this.rng_pptr++] ^= e >> 8 & 255;
          this.rng_pool[this.rng_pptr++] ^= e >> 16 & 255;
          this.rng_pool[this.rng_pptr++] ^= e >> 24 & 255;
          if (this.rng_pptr >= rng_psize)this.rng_pptr -= rng_psize
        };
        this.rng_seed_time = function () {
          this.rng_seed_int((new Date).getTime())
        };
        if (this.rng_pool == null) {
          this.rng_pool = new Array;
          this.rng_pptr = 0;
          var e;
          if (navigator.appName == "Netscape" && navigator.appVersion < "5" && window.crypto) {
            var t = window.crypto.random(32);
            for (e = 0; e < t.length; ++e)this.rng_pool[this.rng_pptr++] = t.charCodeAt(e) & 255
          }
          while (this.rng_pptr < rng_psize) {
            e = Math.floor(65536 * Math.random());
            this.rng_pool[this.rng_pptr++] = e >>> 8;
            this.rng_pool[this.rng_pptr++] = e & 255
          }
          this.rng_pptr = 0;
          this.rng_seed_time()
        }
        this.rng_get_byte = function () {
          if (this.rng_state == null) {
            this.rng_seed_time();
            this.rng_state = prng_newstate();
            this.rng_state.init(this.rng_pool);
            for (this.rng_pptr = 0; this.rng_pptr < this.rng_pool.length; ++this.rng_pptr)this.rng_pool[this.rng_pptr] = 0;
            this.rng_pptr = 0
          }
          return this.rng_state.next()
        };
        this.nextBytes = function (e) {
          var t;
          for (t = 0; t < e.length; ++t)e[t] = this.rng_get_byte()
        }
      }

      function Arcfour() {
        this.i = 0;
        this.j = 0;
        this.S = new Array
      }

      function ARC4init(e) {
        var t, n, r;
        for (t = 0; t < 256; ++t)this.S[t] = t;
        n = 0;
        for (t = 0; t < 256; ++t) {
          n = n + this.S[t] + e[t % e.length] & 255;
          r = this.S[t];
          this.S[t] = this.S[n];
          this.S[n] = r
        }
        this.i = 0;
        this.j = 0
      }

      function ARC4next() {
        var e;
        this.i = this.i + 1 & 255;
        this.j = this.j + this.S[this.i] & 255;
        e = this.S[this.i];
        this.S[this.i] = this.S[this.j];
        this.S[this.j] = e;
        return this.S[e + this.S[this.i] & 255]
      }

      function prng_newstate() {
        return new Arcfour
      }

      pidCryptUtil = {};
      pidCryptUtil.encodeBase64 = function (e, t) {
        if (!e)e = "";
        var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        t = typeof t == "undefined" ? false : t;
        var r, i, s, o, u, a, f, l, c = [], h = "", p, d, v;
        d = t ? pidCryptUtil.encodeUTF8(e) : e;
        p = d.length % 3;
        if (p > 0) {
          while (p++ < 3) {
            h += "=";
            d += "\0"
          }
        }
        for (p = 0; p < d.length; p += 3) {
          r = d.charCodeAt(p);
          i = d.charCodeAt(p + 1);
          s = d.charCodeAt(p + 2);
          o = r << 16 | i << 8 | s;
          u = o >> 18 & 63;
          a = o >> 12 & 63;
          f = o >> 6 & 63;
          l = o & 63;
          c[p / 3] = n.charAt(u) + n.charAt(a) + n.charAt(f) + n.charAt(l)
        }
        v = c.join("");
        v = v.slice(0, v.length - h.length) + h;
        return v
      };
      pidCryptUtil.decodeBase64 = function (e, t) {
        if (!e)e = "";
        var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        t = typeof t == "undefined" ? false : t;
        var r, i, s, o, u, a, f, l, c = [], h, p;
        p = t ? pidCryptUtil.decodeUTF8(e) : e;
        for (var d = 0; d < p.length; d += 4) {
          o = n.indexOf(p.charAt(d));
          u = n.indexOf(p.charAt(d + 1));
          a = n.indexOf(p.charAt(d + 2));
          f = n.indexOf(p.charAt(d + 3));
          l = o << 18 | u << 12 | a << 6 | f;
          r = l >>> 16 & 255;
          i = l >>> 8 & 255;
          s = l & 255;
          c[d / 4] = String.fromCharCode(r, i, s);
          if (f == 64)c[d / 4] = String.fromCharCode(r, i);
          if (a == 64)c[d / 4] = String.fromCharCode(r)
        }
        h = c.join("");
        h = t ? pidCryptUtil.decodeUTF8(h) : h;
        return h
      };
      pidCryptUtil.encodeUTF8 = function (e) {
        if (!e)e = "";
        e = e.replace(/[\u0080-\u07ff]/g, function (e) {
          var t = e.charCodeAt(0);
          return String.fromCharCode(192 | t >> 6, 128 | t & 63)
        });
        e = e.replace(/[\u0800-\uffff]/g, function (e) {
          var t = e.charCodeAt(0);
          return String.fromCharCode(224 | t >> 12, 128 | t >> 6 & 63, 128 | t & 63)
        });
        return e
      };
      pidCryptUtil.decodeUTF8 = function (e) {
        if (!e)e = "";
        e = e.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, function (e) {
          var t = (e.charCodeAt(0) & 31) << 6 | e.charCodeAt(1) & 63;
          return String.fromCharCode(t)
        });
        e = e.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, function (e) {
          var t = (e.charCodeAt(0) & 15) << 12 | (e.charCodeAt(1) & 63) << 6 | e.charCodeAt(2) & 63;
          return String.fromCharCode(t)
        });
        return e
      };
      pidCryptUtil.convertToHex = function (e) {
        if (!e)e = "";
        var t = "";
        var n = "";
        for (var r = 0; r < e.length; r++) {
          n = e.charCodeAt(r).toString(16);
          t += n.length == 1 ? "0" + n : n
        }
        return t
      };
      pidCryptUtil.convertFromHex = function (e) {
        if (!e)e = "";
        var t = "";
        for (var n = 0; n < e.length; n += 2) {
          t += String.fromCharCode(parseInt(e.substring(n, n + 2), 16))
        }
        return t
      };
      pidCryptUtil.stripLineFeeds = function (e) {
        if (!e)e = "";
        var t = "";
        t = e.replace(/\n/g, "");
        t = t.replace(/\r/g, "");
        return t
      };
      pidCryptUtil.toByteArray = function (e) {
        if (!e)e = "";
        var t = [];
        for (var n = 0; n < e.length; n++)t[n] = e.charCodeAt(n);
        return t
      };
      pidCryptUtil.fragment = function (e, t, n) {
        if (!e)e = "";
        if (!t || t >= e.length)return e;
        if (!n)n = "\n";
        var r = "";
        for (var i = 0; i < e.length; i += t)r += e.substr(i, t) + n;
        return r
      };
      pidCryptUtil.formatHex = function (e, t) {
        if (!e)e = "";
        if (!t)t = 45;
        var n = "";
        var r = 0;
        var i = e.toLowerCase();
        for (var s = 0; s < i.length; s += 2)n += i.substr(s, 2) + ":";
        i = this.fragment(n, t);
        return i
      };
      pidCryptUtil.byteArray2String = function (e) {
        var t = "";
        for (var n = 0; n < e.length; n++) {
          t += String.fromCharCode(e[n])
        }
        return t
      };
      Stream.prototype.parseStringHex = function (e, t) {
        if (typeof t == "undefined")t = this.enc.length;
        var n = "";
        for (var r = e; r < t; ++r) {
          var i = this.get(r);
          n += this.hexDigits.charAt(i >> 4) + this.hexDigits.charAt(i & 15)
        }
        return n
      };
      Stream.prototype.get = function (e) {
        if (e == undefined)e = this.pos++;
        if (e >= this.enc.length)throw"Requesting byte offset " + e + " on a stream of length " + this.enc.length;
        return this.enc[e]
      };
      Stream.prototype.hexDigits = "0123456789ABCDEF";
      Stream.prototype.hexDump = function (e, t) {
        var n = "";
        for (var r = e; r < t; ++r) {
          var i = this.get(r);
          n += this.hexDigits.charAt(i >> 4) + this.hexDigits.charAt(i & 15);
          if ((r & 15) == 7)n += " ";
          n += (r & 15) == 15 ? "\n" : " "
        }
        return n
      };
      Stream.prototype.parseStringISO = function (e, t) {
        var n = "";
        for (var r = e; r < t; ++r)n += String.fromCharCode(this.get(r));
        return n
      };
      Stream.prototype.parseStringUTF = function (e, t) {
        var n = "", r = 0;
        for (var i = e; i < t;) {
          var r = this.get(i++);
          if (r < 128)n += String.fromCharCode(r); else if (r > 191 && r < 224)n += String.fromCharCode((r & 31) << 6 | this.get(i++) & 63); else n += String.fromCharCode((r & 15) << 12 | (this.get(i++) & 63) << 6 | this.get(i++) & 63)
        }
        return n
      };
      Stream.prototype.reTime = /^((?:1[89]|2\d)?\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
      Stream.prototype.parseTime = function (e, t) {
        var n = this.parseStringISO(e, t);
        var r = this.reTime.exec(n);
        if (!r)return "Unrecognized time: " + n;
        n = r[1] + "-" + r[2] + "-" + r[3] + " " + r[4];
        if (r[5]) {
          n += ":" + r[5];
          if (r[6]) {
            n += ":" + r[6];
            if (r[7])n += "." + r[7]
          }
        }
        if (r[8]) {
          n += " UTC";
          if (r[8] != "Z") {
            n += r[8];
            if (r[9])n += ":" + r[9]
          }
        }
        return n
      };
      Stream.prototype.parseInteger = function (e, t) {
        if (t - e > 4)return undefined;
        var n = 0;
        for (var r = e; r < t; ++r)n = n << 8 | this.get(r);
        return n
      };
      Stream.prototype.parseOID = function (e, t) {
        var n, r = 0, i = 0;
        for (var s = e; s < t; ++s) {
          var o = this.get(s);
          r = r << 7 | o & 127;
          i += 7;
          if (!(o & 128)) {
            if (n == undefined)n = parseInt(r / 40) + "." + r % 40; else n += "." + (i >= 31 ? "big" : r);
            r = i = 0
          }
          n += String.fromCharCode()
        }
        return n
      };
      if (typeof pidCrypt != "undefined") {
        pidCrypt.ASN1 = function (e, t, n, r, i) {
          this.stream = e;
          this.header = t;
          this.length = n;
          this.tag = r;
          this.sub = i
        };
        pidCrypt.ASN1.prototype.toHexTree = function () {
          var e = {};
          e.type = this.typeName();
          if (e.type != "SEQUENCE")e.value = this.stream.parseStringHex(this.posContent(), this.posEnd());
          if (this.sub != null) {
            e.sub = [];
            for (var t = 0, n = this.sub.length; t < n; ++t)e.sub[t] = this.sub[t].toHexTree()
          }
          return e
        };
        pidCrypt.ASN1.prototype.typeName = function () {
          if (this.tag == undefined)return "unknown";
          var e = this.tag >> 6;
          var t = this.tag >> 5 & 1;
          var n = this.tag & 31;
          switch (e) {
            case 0:
              switch (n) {
                case 0:
                  return "EOC";
                case 1:
                  return "BOOLEAN";
                case 2:
                  return "INTEGER";
                case 3:
                  return "BIT_STRING";
                case 4:
                  return "OCTET_STRING";
                case 5:
                  return "NULL";
                case 6:
                  return "OBJECT_IDENTIFIER";
                case 7:
                  return "ObjectDescriptor";
                case 8:
                  return "EXTERNAL";
                case 9:
                  return "REAL";
                case 10:
                  return "ENUMERATED";
                case 11:
                  return "EMBEDDED_PDV";
                case 12:
                  return "UTF8String";
                case 16:
                  return "SEQUENCE";
                case 17:
                  return "SET";
                case 18:
                  return "NumericString";
                case 19:
                  return "PrintableString";
                case 20:
                  return "TeletexString";
                case 21:
                  return "VideotexString";
                case 22:
                  return "IA5String";
                case 23:
                  return "UTCTime";
                case 24:
                  return "GeneralizedTime";
                case 25:
                  return "GraphicString";
                case 26:
                  return "VisibleString";
                case 27:
                  return "GeneralString";
                case 28:
                  return "UniversalString";
                case 30:
                  return "BMPString";
                default:
                  return "Universal_" + n.toString(16)
              }
              ;
            case 1:
              return "Application_" + n.toString(16);
            case 2:
              return "[" + n + "]";
            case 3:
              return "Private_" + n.toString(16)
          }
        };
        pidCrypt.ASN1.prototype.content = function () {
          if (this.tag == undefined)return null;
          var e = this.tag >> 6;
          if (e != 0)return null;
          var t = this.tag & 31;
          var n = this.posContent();
          var r = Math.abs(this.length);
          switch (t) {
            case 1:
              return this.stream.get(n) == 0 ? "false" : "true";
            case 2:
              return this.stream.parseInteger(n, n + r);
            case 6:
              return this.stream.parseOID(n, n + r);
            case 12:
              return this.stream.parseStringUTF(n, n + r);
            case 18:
            case 19:
            case 20:
            case 21:
            case 22:
            case 26:
              return this.stream.parseStringISO(n, n + r);
            case 23:
            case 24:
              return this.stream.parseTime(n, n + r)
          }
          return null
        };
        pidCrypt.ASN1.prototype.toString = function () {
          return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + (this.sub == null ? "null" : this.sub.length) + "]"
        };
        pidCrypt.ASN1.prototype.print = function (e) {
          if (e == undefined)e = "";
          document.writeln(e + this);
          if (this.sub != null) {
            e += "  ";
            for (var t = 0, n = this.sub.length; t < n; ++t)this.sub[t].print(e)
          }
        };
        pidCrypt.ASN1.prototype.toPrettyString = function (e) {
          if (e == undefined)e = "";
          var t = e + this.typeName() + " @" + this.stream.pos;
          if (this.length >= 0)t += "+";
          t += this.length;
          if (this.tag & 32)t += " (constructed)"; else if ((this.tag == 3 || this.tag == 4) && this.sub != null)t += " (encapsulates)";
          t += "\n";
          if (this.sub != null) {
            e += "  ";
            for (var n = 0, r = this.sub.length; n < r; ++n)t += this.sub[n].toPrettyString(e)
          }
          return t
        };
        pidCrypt.ASN1.prototype.toDOM = function () {
          var e = document.createElement("div");
          e.className = "node";
          e.asn1 = this;
          var t = document.createElement("div");
          t.className = "head";
          var n = this.typeName();
          t.innerHTML = n;
          e.appendChild(t);
          this.head = t;
          var r = document.createElement("div");
          r.className = "value";
          n = "Offset: " + this.stream.pos + "<br/>";
          n += "Length: " + this.header + "+";
          if (this.length >= 0)n += this.length; else n += -this.length + " (undefined)";
          if (this.tag & 32)n += "<br/>(constructed)"; else if ((this.tag == 3 || this.tag == 4) && this.sub != null)n += "<br/>(encapsulates)";
          var i = this.content();
          if (i != null) {
            n += "<br/>Value:<br/><b>" + i + "</b>";
            if (typeof oids == "object" && this.tag == 6) {
              var s = oids[i];
              if (s) {
                if (s.d)n += "<br/>" + s.d;
                if (s.c)n += "<br/>" + s.c;
                if (s.w)n += "<br/>(warning!)"
              }
            }
          }
          r.innerHTML = n;
          e.appendChild(r);
          var o = document.createElement("div");
          o.className = "sub";
          if (this.sub != null) {
            for (var u = 0, a = this.sub.length; u < a; ++u)o.appendChild(this.sub[u].toDOM())
          }
          e.appendChild(o);
          t.switchNode = e;
          t.onclick = function () {
            var e = this.switchNode;
            e.className = e.className == "node collapsed" ? "node" : "node collapsed"
          };
          return e
        };
        pidCrypt.ASN1.prototype.posStart = function () {
          return this.stream.pos
        };
        pidCrypt.ASN1.prototype.posContent = function () {
          return this.stream.pos + this.header
        };
        pidCrypt.ASN1.prototype.posEnd = function () {
          return this.stream.pos + this.header + Math.abs(this.length)
        };
        pidCrypt.ASN1.prototype.toHexDOM_sub = function (e, t, n, r, i) {
          if (r >= i)return;
          var s = document.createElement("span");
          s.className = t;
          s.appendChild(document.createTextNode(n.hexDump(r, i)));
          e.appendChild(s)
        };
        pidCrypt.ASN1.prototype.toHexDOM = function () {
          var e = document.createElement("span");
          e.className = "hex";
          this.head.hexNode = e;
          this.head.onmouseover = function () {
            this.hexNode.className = "hexCurrent"
          };
          this.head.onmouseout = function () {
            this.hexNode.className = "hex"
          };
          this.toHexDOM_sub(e, "tag", this.stream, this.posStart(), this.posStart() + 1);
          this.toHexDOM_sub(e, this.length >= 0 ? "dlen" : "ulen", this.stream, this.posStart() + 1, this.posContent());
          if (this.sub == null)e.appendChild(document.createTextNode(this.stream.hexDump(this.posContent(), this.posEnd()))); else if (this.sub.length > 0) {
            var t = this.sub[0];
            var n = this.sub[this.sub.length - 1];
            this.toHexDOM_sub(e, "intro", this.stream, this.posContent(), t.posStart());
            for (var r = 0, i = this.sub.length; r < i; ++r)e.appendChild(this.sub[r].toHexDOM());
            this.toHexDOM_sub(e, "outro", this.stream, n.posEnd(), this.posEnd())
          }
          return e
        };
        pidCrypt.ASN1.decodeLength = function (e) {
          var t = e.get();
          var n = t & 127;
          if (n == t)return n;
          if (n > 3)throw"Length over 24 bits not supported at position " + (e.pos - 1);
          if (n == 0)return -1;
          t = 0;
          for (var r = 0; r < n; ++r)t = t << 8 | e.get();
          return t
        };
        pidCrypt.ASN1.hasContent = function (e, t, n) {
          if (e & 32)return true;
          if (e < 3 || e > 4)return false;
          var r = new Stream(n);
          if (e == 3)r.get();
          var i = r.get();
          if (i >> 6 & 1)return false;
          try {
            var s = pidCrypt.ASN1.decodeLength(r);
            return r.pos - n.pos + s == t
          } catch (o) {
            return false
          }
        };
        pidCrypt.ASN1.decode = function (e) {
          if (!(e instanceof Stream))e = new Stream(e, 0);
          var t = new Stream(e);
          var n = e.get();
          var r = pidCrypt.ASN1.decodeLength(e);
          var i = e.pos - t.pos;
          var s = null;
          if (pidCrypt.ASN1.hasContent(n, r, e)) {
            var o = e.pos;
            if (n == 3)e.get();
            s = [];
            if (r >= 0) {
              var u = o + r;
              while (e.pos < u)s[s.length] = pidCrypt.ASN1.decode(e);
              if (e.pos != u)throw"Content size is not correct for container starting at offset " + o
            } else {
              try {
                for (; ;) {
                  var a = pidCrypt.ASN1.decode(e);
                  if (a.tag == 0)break;
                  s[s.length] = a
                }
                r = o - e.pos
              } catch (f) {
                throw"Exception while decoding undefined length content: " + f
              }
            }
          } else e.pos += r;
          return new pidCrypt.ASN1(t, i, r, n, s)
        };
        pidCrypt.ASN1.test = function () {
          var e = [{value: [39], expected: 39}, {value: [129, 201], expected: 201}, {
            value: [131, 254, 220, 186],
            expected: 16702650
          }];
          for (var t = 0, n = e.length; t < n; ++t) {
            var r = 0;
            var i = new Stream(e[t].value, 0);
            var s = pidCrypt.ASN1.decodeLength(i);
            if (s != e[t].expected)document.write("In test[" + t + "] expected " + e[t].expected + " got " + s + "\n")
          }
        }
      }
      var dbits;
      var canary = 0xdeadbeefcafe;
      var j_lm = (canary & 16777215) == 15715070;
      if (j_lm && navigator.appName == "Microsoft Internet Explorer") {
        BigInteger.prototype.am = am2;
        dbits = 30
      } else if (j_lm && navigator.appName != "Netscape") {
        BigInteger.prototype.am = am1;
        dbits = 26
      } else {
        BigInteger.prototype.am = am3;
        dbits = 28
      }
      BigInteger.prototype.DB = dbits;
      BigInteger.prototype.DM = (1 << dbits) - 1;
      BigInteger.prototype.DV = 1 << dbits;
      var BI_FP = 52;
      BigInteger.prototype.FV = Math.pow(2, BI_FP);
      BigInteger.prototype.F1 = BI_FP - dbits;
      BigInteger.prototype.F2 = 2 * dbits - BI_FP;
      var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
      var BI_RC = new Array;
      var rr, vv;
      rr = "0".charCodeAt(0);
      for (vv = 0; vv <= 9; ++vv)BI_RC[rr++] = vv;
      rr = "a".charCodeAt(0);
      for (vv = 10; vv < 36; ++vv)BI_RC[rr++] = vv;
      rr = "A".charCodeAt(0);
      for (vv = 10; vv < 36; ++vv)BI_RC[rr++] = vv;
      Classic.prototype.convert = cConvert;
      Classic.prototype.revert = cRevert;
      Classic.prototype.reduce = cReduce;
      Classic.prototype.mulTo = cMulTo;
      Classic.prototype.sqrTo = cSqrTo;
      Montgomery.prototype.convert = montConvert;
      Montgomery.prototype.revert = montRevert;
      Montgomery.prototype.reduce = montReduce;
      Montgomery.prototype.mulTo = montMulTo;
      Montgomery.prototype.sqrTo = montSqrTo;
      BigInteger.prototype.copyTo = bnpCopyTo;
      BigInteger.prototype.fromInt = bnpFromInt;
      BigInteger.prototype.fromString = bnpFromString;
      BigInteger.prototype.clamp = bnpClamp;
      BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
      BigInteger.prototype.drShiftTo = bnpDRShiftTo;
      BigInteger.prototype.lShiftTo = bnpLShiftTo;
      BigInteger.prototype.rShiftTo = bnpRShiftTo;
      BigInteger.prototype.subTo = bnpSubTo;
      BigInteger.prototype.multiplyTo = bnpMultiplyTo;
      BigInteger.prototype.squareTo = bnpSquareTo;
      BigInteger.prototype.divRemTo = bnpDivRemTo;
      BigInteger.prototype.invDigit = bnpInvDigit;
      BigInteger.prototype.isEven = bnpIsEven;
      BigInteger.prototype.exp = bnpExp;
      BigInteger.prototype.toString = bnToString;
      BigInteger.prototype.negate = bnNegate;
      BigInteger.prototype.abs = bnAbs;
      BigInteger.prototype.compareTo = bnCompareTo;
      BigInteger.prototype.bitLength = bnBitLength;
      BigInteger.prototype.mod = bnMod;
      BigInteger.prototype.modPowInt = bnModPowInt;
      BigInteger.ZERO = nbv(0);
      BigInteger.ONE = nbv(1);
      NullExp.prototype.convert = nNop;
      NullExp.prototype.revert = nNop;
      NullExp.prototype.mulTo = nMulTo;
      NullExp.prototype.sqrTo = nSqrTo;
      Barrett.prototype.convert = barrettConvert;
      Barrett.prototype.revert = barrettRevert;
      Barrett.prototype.reduce = barrettReduce;
      Barrett.prototype.mulTo = barrettMulTo;
      Barrett.prototype.sqrTo = barrettSqrTo;
      var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509];
      var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
      BigInteger.prototype.chunkSize = bnpChunkSize;
      BigInteger.prototype.toRadix = bnpToRadix;
      BigInteger.prototype.fromRadix = bnpFromRadix;
      BigInteger.prototype.fromNumber = bnpFromNumber;
      BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
      BigInteger.prototype.changeBit = bnpChangeBit;
      BigInteger.prototype.addTo = bnpAddTo;
      BigInteger.prototype.dMultiply = bnpDMultiply;
      BigInteger.prototype.dAddOffset = bnpDAddOffset;
      BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
      BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
      BigInteger.prototype.modInt = bnpModInt;
      BigInteger.prototype.millerRabin = bnpMillerRabin;
      BigInteger.prototype.clone = bnClone;
      BigInteger.prototype.intValue = bnIntValue;
      BigInteger.prototype.byteValue = bnByteValue;
      BigInteger.prototype.shortValue = bnShortValue;
      BigInteger.prototype.signum = bnSigNum;
      BigInteger.prototype.toByteArray = bnToByteArray;
      BigInteger.prototype.equals = bnEquals;
      BigInteger.prototype.min = bnMin;
      BigInteger.prototype.max = bnMax;
      BigInteger.prototype.and = bnAnd;
      BigInteger.prototype.or = bnOr;
      BigInteger.prototype.xor = bnXor;
      BigInteger.prototype.andNot = bnAndNot;
      BigInteger.prototype.not = bnNot;
      BigInteger.prototype.shiftLeft = bnShiftLeft;
      BigInteger.prototype.shiftRight = bnShiftRight;
      BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
      BigInteger.prototype.bitCount = bnBitCount;
      BigInteger.prototype.testBit = bnTestBit;
      BigInteger.prototype.setBit = bnSetBit;
      BigInteger.prototype.clearBit = bnClearBit;
      BigInteger.prototype.flipBit = bnFlipBit;
      BigInteger.prototype.add = bnAdd;
      BigInteger.prototype.subtract = bnSubtract;
      BigInteger.prototype.multiply = bnMultiply;
      BigInteger.prototype.divide = bnDivide;
      BigInteger.prototype.remainder = bnRemainder;
      BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
      BigInteger.prototype.modPow = bnModPow;
      BigInteger.prototype.modInverse = bnModInverse;
      BigInteger.prototype.pow = bnPow;
      BigInteger.prototype.gcd = bnGCD;
      BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
      Arcfour.prototype.init = ARC4init;
      Arcfour.prototype.next = ARC4next;
      var rng_psize = 256;
      if (typeof pidCrypt != "undefined" && typeof BigInteger != "undefined" && typeof SecureRandom != "undefined" && typeof Arcfour != "undefined") {
        function parseBigInt(e, t) {
          return new BigInteger(e, t)
        }

        function linebrk(e, t) {
          var n = "";
          var r = 0;
          while (r + t < e.length) {
            n += e.substring(r, r + t) + "\n";
            r += t
          }
          return n + e.substring(r, e.length)
        }

        function byte2Hex(e) {
          if (e < 16)return "0" + e.toString(16); else return e.toString(16)
        }

        function pkcs1unpad2(e, t) {
          var n = e.toByteArray();
          var r = 0;
          while (r < n.length && n[r] == 0)++r;
          if (n.length - r != t - 1 || n[r] != 2)return null;
          ++r;
          while (n[r] != 0)if (++r >= n.length)return null;
          var i = "";
          while (++r < n.length)i += String.fromCharCode(n[r]);
          return i
        }

        function pkcs1pad2(e, t) {
          if (t < e.length + 11) {
            alert("Message too long for RSA");
            return null
          }
          var n = new Array;
          var r = e.length - 1;
          while (r >= 0 && t > 0) {
            n[--t] = e.charCodeAt(r--)
          }
          n[--t] = 0;
          var i = new SecureRandom;
          var s = new Array;
          while (t > 2) {
            s[0] = 0;
            while (s[0] == 0)i.nextBytes(s);
            n[--t] = s[0]
          }
          n[--t] = 2;
          n[--t] = 0;
          return new BigInteger(n)
        }

        pidCrypt.RSA = function () {
          this.n = null;
          this.e = 0;
          this.d = null;
          this.p = null;
          this.q = null;
          this.dmp1 = null;
          this.dmq1 = null;
          this.coeff = null
        };
        pidCrypt.RSA.prototype.doPrivate = function (e) {
          if (this.p == null || this.q == null)return e.modPow(this.d, this.n);
          var t = e.mod(this.p).modPow(this.dmp1, this.p);
          var n = e.mod(this.q).modPow(this.dmq1, this.q);
          while (t.compareTo(n) < 0)t = t.add(this.p);
          return t.subtract(n).multiply(this.coeff).mod(this.p).multiply(this.q).add(n)
        };
        pidCrypt.RSA.prototype.setPublic = function (e, t, n) {
          if (typeof n == "undefined")n = 16;
          if (e != null && t != null && e.length > 0 && t.length > 0) {
            this.n = parseBigInt(e, n);
            this.e = parseInt(t, n)
          } else alert("Invalid RSA public key")
        };
        pidCrypt.RSA.prototype.doPublic = function (e) {
          return e.modPowInt(this.e, this.n)
        };
        pidCrypt.RSA.prototype.encryptRaw = function (e) {
          var t = pkcs1pad2(e, this.n.bitLength() + 7 >> 3);
          if (t == null)return null;
          var n = this.doPublic(t);
          if (n == null)return null;
          var r = n.toString(16);
          if ((r.length & 1) == 0)return r; else return "0" + r
        };
        pidCrypt.RSA.prototype.encrypt = function (e) {
          e = pidCryptUtil.encodeBase64(e);
          return this.encryptRaw(e)
        };
        pidCrypt.RSA.prototype.decryptRaw = function (e) {
          var t = parseBigInt(e, 16);
          var n = this.doPrivate(t);
          if (n == null)return null;
          return pkcs1unpad2(n, this.n.bitLength() + 7 >> 3)
        };
        pidCrypt.RSA.prototype.decrypt = function (e) {
          var t = this.decryptRaw(e);
          t = t ? pidCryptUtil.decodeBase64(t) : "";
          return t
        };
        pidCrypt.RSA.prototype.setPrivate = function (e, t, n, r) {
          if (typeof r == "undefined")r = 16;
          if (e != null && t != null && e.length > 0 && t.length > 0) {
            this.n = parseBigInt(e, r);
            this.e = parseInt(t, r);
            this.d = parseBigInt(n, r)
          } else alert("Invalid RSA private key")
        };
        pidCrypt.RSA.prototype.setPrivateEx = function (e, t, n, r, i, s, o, u, a) {
          if (typeof a == "undefined")a = 16;
          if (e != null && t != null && e.length > 0 && t.length > 0) {
            this.n = parseBigInt(e, a);
            this.e = parseInt(t, a);
            this.d = parseBigInt(n, a);
            this.p = parseBigInt(r, a);
            this.q = parseBigInt(i, a);
            this.dmp1 = parseBigInt(s, a);
            this.dmq1 = parseBigInt(o, a);
            this.coeff = parseBigInt(u, a)
          } else alert("Invalid RSA private key")
        };
        pidCrypt.RSA.prototype.generate = function (e, t) {
          var n = new SecureRandom;
          var r = e >> 1;
          this.e = parseInt(t, 16);
          var i = new BigInteger(t, 16);
          for (; ;) {
            for (; ;) {
              this.p = new BigInteger(e - r, 1, n);
              if (this.p.subtract(BigInteger.ONE).gcd(i).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10))break
            }
            for (; ;) {
              this.q = new BigInteger(r, 1, n);
              if (this.q.subtract(BigInteger.ONE).gcd(i).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10))break
            }
            if (this.p.compareTo(this.q) <= 0) {
              var s = this.p;
              this.p = this.q;
              this.q = s
            }
            var o = this.p.subtract(BigInteger.ONE);
            var u = this.q.subtract(BigInteger.ONE);
            var a = o.multiply(u);
            if (a.gcd(i).compareTo(BigInteger.ONE) == 0) {
              this.n = this.p.multiply(this.q);
              this.d = i.modInverse(a);
              this.dmp1 = this.d.mod(o);
              this.dmq1 = this.d.mod(u);
              this.coeff = this.q.modInverse(this.p);
              break
            }
          }
        };
        pidCrypt.RSA.prototype.getASNData = function (e) {
          var t = {};
          var n = [];
          var r = 0;
          if (e.value && e.type == "INTEGER")n[r++] = e.value;
          if (e.sub)for (var i = 0; i < e.sub.length; i++)n = n.concat(this.getASNData(e.sub[i]));
          return n
        };
        pidCrypt.RSA.prototype.setKeyFromASN = function (e, t) {
          var n = ["N", "E", "D", "P", "Q", "DP", "DQ", "C"];
          var r = {};
          var i = this.getASNData(t);
          switch (e) {
            case"Public":
            case"public":
              for (var s = 0; s < i.length; s++)r[n[s]] = i[s].toLowerCase();
              this.setPublic(r.N, r.E, 16);
              break;
            case"Private":
            case"private":
              for (var s = 1; s < i.length; s++)r[n[s - 1]] = i[s].toLowerCase();
              this.setPrivateEx(r.N, r.E, r.D, r.P, r.Q, r.DP, r.DQ, r.C, 16);
              break
          }
        };
        pidCrypt.RSA.prototype.setPublicKeyFromASN = function (e) {
          this.setKeyFromASN("public", e)
        };
        pidCrypt.RSA.prototype.setPrivateKeyFromASN = function (e) {
          this.setKeyFromASN("private", e)
        };
        pidCrypt.RSA.prototype.getParameters = function () {
          var e = {};
          if (this.n != null)e.n = this.n;
          e.e = this.e;
          if (this.d != null)e.d = this.d;
          if (this.p != null)e.p = this.p;
          if (this.q != null)e.q = this.q;
          if (this.dmp1 != null)e.dmp1 = this.dmp1;
          if (this.dmq1 != null)e.dmq1 = this.dmq1;
          if (this.coeff != null)e.c = this.coeff;
          return e
        }
      }

      var public_key = "-----BEGIN PUBLIC KEY-----\n\
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCsmY4m5S2o6OQDWeZLZzIJGZX4rROiSESoamtcoT8vLk3GfboTwBNhMv1UyR9zYCbZ45PTlN/6DrLB/kf2RAQwiUzsa5jkWlzdA9TsSKoLDNHQnTGTMCuHzzg+lXEkeO6GR9mDbtHlwBcLCE1ORhkKJxU0JPGIhhUreA4aawfgYQIDAQAB\n\
-----END PUBLIC KEY-----\
";

      function formatString(str) {
        var tmp = '';
        for (var i = 0; i < str.length; i += 80)
          tmp += '   ' + str.substr(i, 80) + '\n';
        return tmp;
      }

      function showData(tree) {
        var data = '';
        var val = '';
        if (tree.value)
          val = tree.value;
        data += tree.type + ':' + val.substr(0, 48) + '...\n';
        if (tree.sub)
          for (var i = 0; i < tree.sub.length; i++)
            data += showData(tree.sub[i]);
        return data;
      }

      var certParser = function(cert) {
        var lines = cert.split('\n');
        var read = false;
        var b64 = false;
        var end = false;
        var flag = '';
        var retObj = {};
        retObj.info = '';
        retObj.salt = '';
        retObj.iv;
        retObj.b64 = '';
        retObj.aes = false;
        retObj.mode = '';
        retObj.bits = 0;
        for (var i = 0; i < lines.length; i++) {
          flag = lines[i].substr(0, 9);
          if (i == 1 && flag != 'Proc-Type' && flag.indexOf('M') == 0)//unencrypted cert?
            b64 = true;
          switch (flag) {
            case '-----BEGI':
              read = true;
              break;
            case 'Proc-Type':
              if (read)
                retObj.info = lines[i];
              break;
            case 'DEK-Info:':
              if (read) {
                var tmp = lines[i].split(',');
                var dek = tmp[0].split(': ');
                var aes = dek[1].split('-');
                retObj.aes = (aes[0] == 'AES') ? true : false;
                retObj.mode = aes[2];
                retObj.bits = parseInt(aes[1]);
                retObj.salt = tmp[1].substr(0, 16);
                retObj.iv = tmp[1];
              }
              break;
            case '':
              if (read)
                b64 = true;
              break;
            case '-----END ':
              if (read) {
                b64 = false;
                read = false;
              }
              break;
            default:
              if (read && b64)
                retObj.b64 += pidCryptUtil.stripLineFeeds(lines[i]);
          }
        }
        return retObj;
      }

      var compute = function (string) {

        // var hexStr = 'A3C9D10BDDC14811BC92E2D29282F62F1E449E2DD9B9CE3CA74D637ADAD49778BFEA4ACEE58C146E73E579876422871F625C8B0D2202131003C5A6C14F03493DB785B66A450A3418B2DC332A4A35AF7C89549B9902B2813CF79749198610F651ED33BE4C8B5753695F6D3461414C85C9237E67BB69A8A057A4841445A56955FA55ED27895A27FEB8A31453C6DE0B44259214AF1E23AA8011D68D2B115EE0D912B8E9C8F49D6A46685E778AC867BDD0361A52A7CE2F98702689D11E3BFB3746AB1F36F35033DA5FC38CA8F50178F6D2B37C39EEDABEF10FC0FD33E8FCED5A1D2677067B375DA83C9A8344391889FEE7B1BFC1282125563B3EDE479D4AD78CCF1F';

        // alert(hex2b64(hexStr) + '\n' + pidCryptUtil.encodeBase64(pidCryptUtil.convertFromHex(hexStr)));


        var params = {};
        var result = '';
        var color = '';
        var crypted = ""

        //read cert
        params = certParser(public_key);

        if (params.b64) {
          var key = pidCryptUtil.decodeBase64(params.b64);
          //new RSA instance
          var rsa = new pidCrypt.RSA();
          //RSA encryption
          //ASN1 parsing
          var asn = pidCrypt.ASN1.decode(pidCryptUtil.toByteArray(key));
          var tree = asn.toHexTree();
          //setting the public key for encryption
          rsa.setPublicKeyFromASN(tree);
          var t = new Date();  // timer
          crypted = rsa.encrypt(string);
          var crypted = pidCryptUtil.fragment(pidCryptUtil.encodeBase64(pidCryptUtil.convertFromHex(crypted)), 64);
          console.log(crypted);
          return crypted;
        } else {
          return null;
        }
      }
      return {compute: compute};
    });