
import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


(async () => {

  let result = null;
  let airlines = null;
  let flightName = null;
  let depature = null;


  let code_meaning = {
    0: "UNKNOWN",
    10: "ON_TIME",
    20: "LATE_AIRLINE",
    30: "LATE_WEATHER",
    40: "LATE_TECHNICAL",
    50: "LATE_OTHER"
  }
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }


  let contract = new Contract('localhost', () => {

    // Read transaction
    contract.isOperational((error, result) => {
      console.log(error, result);
      display('Operational Status', 'Check if contract is operational', [{ label: 'Operational Status', error: error, value: result }], "display-wrapper", "");
    });



    // Fetch flight status

    // begin flight selection
    let dropdown = document.getElementById('flight-number');
    dropdown.length = 0;

    const url = 'http://localhost:3000/flights';  //our url here

    fetch(url)
      .then(
        function (response) {
          if (response.status !== 200) {
            console.warn('Looks like there was a problem. Status Code: ' + response.status);
            return;
          }

          // Examine the text in the response  
          response.json().then(function (data) {
            let option;
            data = data.result
            for (let i = 0; i < data.length; i++) {
              option = document.createElement('option');
              option.text = data[i].name;
              option.value = data[i].name;
              dropdown.add(option);
            }
          });
        }
      )
      .catch(function (err) {
        console.error('Fetch Error -', err);
      });
    //end


    // User-submitted transaction
    DOM.elid('submit-oracle').addEventListener('click', () => {
      let flight = DOM.elid('flight-number').value;                // Get fight number
      let depatureDate = DOM.elid('depature-date').value;          // Get depature date

      // Write transaction
      contract.fetchFlightStatus(flight, depatureDate, (error, result) => {
        airlines = result.airline;
        depature = result.timestamp;
        flightName = result.flight;

        DOM.elid("table-report").style.display = "none";
        DOM.elid("withdrawn").style.display = "none";

        display('Oracles', 'Trigger oracles', [{ label: 'Fetch Flight Status', error: error, value: result.flight + ' ' + result.timestamp, date_: depatureDate }], "display-flight", "");
      });
    });

    // GEt oracles response
    DOM.elid('oracle-response').addEventListener('click', () => {


      fetchOracleIndex();

      sleep(500).then(() => {
        let airline = airlines;
        let flight = flightName;
        let timestamps = depature;
        let eventIndex_ = DOM.elid('holdIndex').innerHTML;

        contract.submitOracleResponse(parseInt(eventIndex_), airline, flight, timestamps, (error, result) => {
          console.log("The value event is ", eventIndex_);

          DOM.elid("oracle-response").style.display = "none";
          DOM.elid("table-report").style.display = "block";

          DOM.elid('status-code').innerHTML = code_meaning[result.statusCode];
          DOM.elid('flight-name').innerHTML = result.flight;
          DOM.elid('timestamp').innerHTML = result.timestamp;

          if (result.statusCode == 20 || result.statusCode == 40) {

            DOM.elid('amount').innerHTML = DOM.elid('delay').innerHTML;
            DOM.elid("withdraw-funds").style.display = "block";
          } else {
            DOM.elid('amount').innerHTML = 0;

          }


        });
      })

    })


    // Listen to input change.
    DOM.elid('insurance').addEventListener('change', () => {
      let insurance = DOM.elid('insurance').value;
      let delay = document.getElementById('delay');
      let premium = document.getElementById('premium');
      premium.innerHTML = insurance + ' ether';
      delay.innerHTML = (insurance * 1.5) + ' ether';
    });

    // Listen to pay insurance event
    DOM.elid('pay').addEventListener('click', () => {
      let price = DOM.elid('insurance').value;
      let fname = DOM.elid("flightName").innerHTML;
      let fdate = DOM.elid("flightDate").innerHTML;
      // buy flight insurance

      contract.buy(price, (error, result) => {
        console.log("Insurance purchased with", price);
        display('Oracles', 'Trigger oracles', [{ label: 'Assurance Detail', error: error, value: "Flight Name: " + fname + " | Depature Date: " + fdate + " | Assurance Paid: " + price + " ether" + " | Paid on Delay: " + price * 1.5 + " ether" }], "display-flight", "display-detail");



      });
    });
    // Passenger withdraw funds
    DOM.elid('withdraw-funds').addEventListener('click', () => {
      contract.withdraw((error, result) => {

        DOM.elid('withdraw-funds').style.display = "none";
        DOM.elid('table-report').style.display = "none";

        DOM.elid("withdrawn-value").innerHTML = DOM.elid("delay").innerHTML;
        DOM.elid("withdrawn").style.display = "block";
        console.log('Successfull');
      });

    })
    // end insurance purchase function


  });


})();


function display(title, description, results, id, cls) {
  let displayDiv = DOM.elid(id.toString());
  let section = DOM.section();
  section.appendChild(DOM.h2(title));
  section.appendChild(DOM.h5(description));
  results.map((result) => {
    let row = section.appendChild(DOM.div({ className: 'row' }));
    row.appendChild(DOM.div({ className: 'col-sm-4 field' }, result.label));
    if (cls.toString() == "display-detail") {
      row.appendChild(DOM.div({ className: 'col-sm-8 field-value' }, result.error ? String(result.error) : String(result.value)));
      //row.appendChild(DOM.button({className: 'oracle-response'}, "Check Payout"));
      DOM.elid("oracle-response").style.display = "block";
    } else
      row.appendChild(DOM.div({ className: 'col-sm-3 field-value' }, result.error ? String(result.error) : String(result.value)));
    if (id.toString() == "display-flight" && cls.toString() == "") {
      let b = DOM.button({ className: 'col-sm-2 field btn btn-primary buy-insurance' }, "View Insurance Policy");
      b.setAttribute("data-toggle", "modal");
      b.setAttribute("data-target", "#myModal");
      row.appendChild(b);

      // Add value to modal
      let fname = DOM.elid("flightName");
      let fdate = DOM.elid("flightDate");
      fname.innerHTML = result.value.split(' ')[0];
      fdate.innerHTML = result.date_;

    }

    section.appendChild(row);
  })

  displayDiv.removeChild(displayDiv.firstChild);
  displayDiv.append(section);

}



function fetchOracleIndex(response) {
  // Fetch flight status
  const responseURL = 'http://localhost:3000/eventIndex';  //our url here

  fetch(responseURL)
    .then(
      function (res) {
        if (res.status !== 200) {
          console.warn('Looks like there was a problem. Status Code: ' + res.status);
          return;
        }

        // Examine the text in the response
        res.json().then(function (dataf) {
          let p = document.getElementById('holdIndex');
          dataf = dataf.result;
          p.innerHTML = parseInt(dataf);
        });
      }
    )
    .catch(function (err) {
      console.error('Fetch Error -', err);
    });
}