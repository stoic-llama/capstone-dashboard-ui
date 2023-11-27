// fetch('http://localhost:7100/api/v1/applications')  // local debug only
fetch('http://helpmybabies.com:7100/api/v1/applications')
.then(response => response.json())
.then(result => filterRows(result))
.then(filteredResult => generateRows(filteredResult))
.catch( function(error) {
    console.log(error)

    const main = document.querySelector('.main-title')
    const section = document.createElement('section')
    section.innerHTML = `
      <div style="padding-inline-start: 5rem;">
        <p>Oops, we could not find any metrics.</p>
        <p>You can try again tomorrow for the next refresh of our data in the database.</p>
      </div>
    `
    main.appendChild(section)
})

// Can't make this up, thanks to ChatGPT on a 4am debugging session for filterRows() algorithm
// https://chat.openai.com/c/93d6c4fc-b1ce-454c-a9a0-5348bae01929
function filterRows(result) {
    const latestTimestamps = {}; // Object to store the latest timestamps for each name

    console.log("Hello world")
    // Iterate through the array and find the latest timestamp for each name
    result.forEach(obj => {
      const name = obj.name;

      // Note: The string format should be: YYYY-MM-DDTHH:mm:ss.sssZ , 
      // where: YYYY-MM-DD – is the date: year-month-day. 
      // The character "T" is used as the delimiter. 
      // HH:mm:ss.sss – is the time: hours, minutes, seconds and milliseconds.
      // Refer https://javascript.info/date#:~:text=The%20string%20format%20should%20be,%2C%20minutes%2C%20seconds%20and%20milliseconds.
      const timestamp = new Date(obj.timestamp).getTime();
    
      if (!latestTimestamps[name] || timestamp > latestTimestamps[name]) {
        latestTimestamps[name] = timestamp;
      }
    });
    
    // Create an array of objects with the latest timestamp for each name
    const filteredResult = result.filter(obj => {
      return new Date(obj.timestamp).getTime() === latestTimestamps[obj.name];
    });
    
    return filteredResult
}


function generateRows(result) {
  const fragment = document.createDocumentFragment()
  const main = document.querySelector('.main-container')
    
  console.log(main)
  
  result.forEach( (item, index) => {
      const div = document.createElement('div')
      const status = (item.availability === 'UP' ? 'green' : 'red')
      div.innerHTML = `
        <div>
            <h3 class="row-title">${item.name}</h3>
            <small style="color: lightgray;">Last Updated on ${item.timestamp}</small> 
        </div>

        <div class="main-cards" style="margin-block-end: 3em;">
            <div style="background-color: ${status}" class="card">
                <div class="card-inner">
                <h3>AVAILABILITY</h3>
                </div>
                <h1>${item.availability}</h1>
            </div>

            <div class="card">
                <div class="card-inner">
                <h3>TIME TO PROD</h3>
                </div>
                <h1>
                ${item.timeToProd}
                <small style="font-size: small;">seconds</small>              
                </h1>
            </div>

            <div class="card">
                <div class="card-inner">
                <h3>FREQ TO PROD</h3>
                </div>
                <h1>
                ${item.freqToProd}
                <small style="font-size: small;">per month</small>
                </h1>
            </div>

            <div class="card">
                <div class="card-inner">
                <h3>MTTR</h3>
                </div>
                <h1>
                ${item.mttr}
                <small style="font-size: small;">minutes</small>
                </h1>
            </div>

            <div class="card">
                <div class="card-inner">
                <h3>CHANGE FAIL RATE</h3>
                </div>
                <h1>
                ${item.changeFailRate}
                <small style="font-size: small;">%</small>
                </h1>
            </div>
        </div>    
    `

    fragment.appendChild(div)
  })

  main.appendChild(fragment)
}