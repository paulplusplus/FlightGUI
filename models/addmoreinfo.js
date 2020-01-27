const conn = require('./database');


var airports = [
    ['MIA', 'Florida', 'USA'], 
    ['ATL', 'Georgia', 'USA'], 
    ['ORD', 'Illinois', 'USA'],
    ['DFW', 'Texas', 'USA'], 
    ['DEN', 'Denver', 'USA'], 
    ['SFO', 'California', 'USA'],
    ['SEA', 'Washington', 'USA'], 
    ['LAS', 'Nevada', 'USA'], 
    ['MCO', 'Florida', 'USA'],
    ['EWR', 'New Jersey', 'USA'], 
    ['CLT', 'North Carolina', 'USA'], 
    ['PHX', 'Arizona', 'USA'],
    ['IAH', 'Texas', 'USA'], 
    ['BOS', 'Massachusetts', 'USA'], 
    ['MSP', 'Minnesota', 'USA'],
    ['FLL', 'Florida', 'USA'], 
    ['DTW', 'Michagan', 'USA'], 
    ['PHL', 'Pennsylvania', 'USA'],
    ['BWI', 'Maryland', 'USA'], 
    ['SLC', 'Utah', 'USA'], 
    ['IAD', 'Virginia', 'USA'],
    ['HNL', 'Hawaii', 'USA'], 
    ['SAN', 'California', 'USA'], 
    ['MDW', 'Illinois', 'USA']
]

var airline = [
    ['Alaska Airlines'], 
    ['Southwest Airlines'],
    ['Frontier Airlines'], 
    ['Spirit Airlines'],
    ['Hawaiian Airlines'], 
    ['Allegiant Air']
];

var flight = [
    [1, 'CLT', 'LAS', 26, 250, 1, 200, '02-12-2020', '14:50', '04:00'], 
    [2, 'PHX', 'BOS', 51, 250, 1, 290, '02-03-2020', '09:50', '03:50'],
    [3, 'BOS', 'DFW', 20, 250, 1, 260, '02-06-2020', '13:50', '04:00'], 
    [4, 'ORD', 'MIA', 15, 250, 1, 220, '02-05-2020', '08:50', '02:59'],
    [5, 'SFO', 'EWR', 10, 250, 1, 305, '02-09-2020', '15:50', '04:00'], 
    [6, 'LAX', 'EWR', 100, 250, 1, 320, '02-01-2020', '06:50', '03:40'],
    [7, 'SFO', 'JFK', 225, 250, 1, 350, '02-01-2020', '12:50', '04:00'], 
    [8, 'BOS', 'FLL', 227, 250, 1, 220, '02-03-2020', '09:50', '02:50'],
    [9, 'SLC', 'DEN', 152, 250, 1, 150, '02-06-2020', '15:50', '02:00'], 
    [8, 'DEN', 'LAX', 125, 250, 1, 300, '02-13-2020', '16:50', '02:50'],
    [6, 'FLL', 'LAX', 200, 250, 1, 99, '02-08-2020', '17:50', '02:00'], 
    [3, 'MCO', 'SFO', 65, 250, 1, 400, '02-10-2020', '19:50', '02:50'],
    [4, 'SEA', 'DTW', 39, 250, 1, 250, '02-03-2020', '16:50', '03:00'], 
    [5, 'PHL', 'JFK', 76, 250, 1, 200, '02-02-2020', '14:50', '01:50'],
    [8, 'IAD', 'SLC', 99, 250, 1, 350, '02-02-2020', '18:50', '04:00'], 
    [7, 'LAX', 'HNL', 210, 250, 1, 750, '02-01-2020', '09:50', '08:50']
];

const dbcon = conn('flight.db');
dbcon.serialize( () => {
        for(var airp of airports){
            dbcon.run('INSERT INTO Airports(AirportName, CityName, Country) VALUES(?, ?, ?)', airp);
        }
        for(var airl of airline){
            dbcon.run('INSERT INTO Airlines(AirlineName) VALUES(?)', airl);
        }
        for(var flig of flight){
            dbcon.run('INSERT INTO Flights(AirlineID, Origin, Destination, CurrentPassengers, Capacity, FlightStatus, Fare, FlightDate, DepartureTime, FlightTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', flig);
        }
});
