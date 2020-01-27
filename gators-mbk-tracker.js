var LitElement = LitElement || Object.getPrototypeOf(customElements.get("home-assistant-main"));
var html = LitElement.prototype.html;

class GatorsMbkTracker extends LitElement {

  render() {
    var message = html`<span class="cal-message" id="calMessage">${this.getMessage()}</span>`
    var day = html`<span class="cal-day" id="calDay">${this.getDay()}</span>`;
    var month = html`<span class="cal-month" id="calMonth">${this.getMonth()}</span>`;
    var logo = html`<span class="cal-logo" id="calLogo"></span>`;
    var times = html`<span class="cal-times" id="calTimes">${this.getTimes()}</span>`;
    var location = html`<span class="cal-location" id="calLocation"><ha-icon icon="mdi:map-marker"></ha-icon><span id="calLocationText">${this.getLocation()}</span></span>`;

    return html`
      <style>
      ${this.style()}
      </style>
      <ha-card class = "card">
        <div class="cal-date-col">
          <div class="cal-day-row">
            ${day}
          </div>
          <div class="cal-month-row">
            ${month}
          </div>
        </div>
        <div class="cal-logo-col">
          ${logo}
        </div>
        <div class="cal-content-col">
          <div class="cal-content-col-message-row">
            ${message}
          </div>
          <div class="cal-content-col-times-row">
            ${times}
          </div>
          <div class="cal-content-col-location-row">
            ${location}
          </div>
        </div>
        <div style="clear:both;"></div>
      </ha-card>
    `;
  }

  getMessage() {
    var messageText = this._hass.states[this.config.entity].attributes.message;
    if (messageText.substring(0, 31) == "Florida Gators Men's Basketball") {
      messageText = "MBK" + messageText.substring(31);
    }
    return `${messageText} (${this.getTV()})`;
  }

  getLocation() {
    var locationText = this._hass.states[this.config.entity].attributes.location;
    var indexOfComma = locationText.indexOf(",");
    if (indexOfComma > 0) {
      locationText = locationText.substring(0, indexOfComma + 4);
    }
    return locationText;
  }

  getTV() {
    var desc = this._hass.states[this.config.entity].attributes.description;
    var pattern = /(?<=\bTV:\s)(\w+)/g;
    var result = pattern.exec(desc);
    if (result) {
      return result[0];
    }
    else return "";
  }

  getDay() {
    var startTime = this._hass.states[this.config.entity].attributes.start_time;
    var day = "??";
    if (startTime) {
      var date = new Date(startTime);
      day = date.getDate().toString();
    }
    return day;
  }

  getMonth() {
    const monthNames = [
      "January", 
      "February", 
      "March", 
      "April", 
      "May", 
      "June", 
      "July", 
      "August", 
      "September", 
      "October", 
      "November", 
      "December"
    ];
    
    var startTime = this._hass.states[this.config.entity].attributes.start_time;
    var month = "???";
    if (startTime) {
      var date = new Date(startTime);
      month = monthNames[date.getMonth()];
      month = month.substr(0, 3).toUpperCase();
    }

    return month;
  }

  getTimeStr(d) {
    var hr = d.getHours();
    var mi = d.getMinutes();
    
    var amPm = hr >= 12 ? "PM" : "AM";
    hr = hr % 12;
    hr = hr == 0 ? 12 : hr;
    
    mi = mi.toString().padStart(2, "0");
    
    return hr + ":" + mi + amPm;
  }

  getTimes() {
    var startTime = this._hass.states[this.config.entity].attributes.start_time;
    var endTime = this._hass.states[this.config.entity].attributes.end_time;

    if (startTime && endTime) {
      var s = new Date(startTime);
      var e = new Date(endTime);

      return `${this.getTimeStr(s)}-${this.getTimeStr(e)}`;
    }
    else {
      return "";
    }
  }

  style() {
    return html`
      ha-card {
        padding: 16px 16px 4px 16px;
      }
      .cal-date-col, .cal-logo-col, .cal-content-col {
        float: left
      }
      .cal-date-col, .cal-logo-col {
        margin-right: 10px;
      }
      .cal-date-col {
        border-right: solid 2px var(--primary-text-color);
        padding: 2px 12px 10px 0;
      }
      .cal-day {
        font-size: 28px;
      }
      .cal-month {
        font-size: 16px;
      }
      .cal-logo {
        display: block;
        width: 75px;
        height: 75px;
        background: url('/local/images/gator-75.png') 0px -4px no-repeat;
      }
      .cal-message {
        font-size: 20px;
      }
      .cal-times {
        font-size: 16px;
      }
      .cal-location {
        font-size: 16px;
      }
    `;
  }

  set hass(hass) {
    this._hass = hass;
    this.updateValues();
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }
    this.config = config;
  }

  updateValues() {
    console.log("update");
    const root = this.shadowRoot;
    if (root.childElementCount > 0) {
      root.getElementById("calMessage").textContent = this.getMessage();
      root.getElementById("calDay").textContent = this.getDay();
      root.getElementById("calMonth").textContent = this.getMonth();
      root.getElementById("calTimes").textContent = this.getTimes();
      root.getElementById("calLocationText").textContent = this.getLocation();
      root.getElementById("calTV")
    }
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }
}

customElements.define('gators-mbk-tracker', GatorsMbkTracker);
