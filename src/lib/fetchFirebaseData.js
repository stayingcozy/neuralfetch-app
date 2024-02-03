import { query, orderBy, limit, where, getDocs, Timestamp } from 'firebase/firestore';


export async function fetchWeekData( actRef ) {

    // Get the date at the start of the week for date range
    const weekDaysTS = getWeekDateRange();

    // Loop all queries qArray, each one await for docs and map 
    let weekLength = weekDaysTS.length;
    let startOfDay_ts;
    let prevDay_ts;
    let qArray = [];
    for (let i = 0; i < weekLength; i++) {
        // console.log("i: ", i);
        // console.log("weekDaysTS[i]: ", weekDaysTS[i]);
        startOfDay_ts = weekDaysTS[i];

        if (i === 0) {
            qArray.push(
                query(
                actRef,
                where('timestamp', '>=', startOfDay_ts),
                limit(1000),
                orderBy('timestamp', 'desc')
            ));
        }
        else {
            prevDay_ts = weekDaysTS[i - 1];
            qArray.push(
                query(
                actRef,
                where('timestamp', '>=', startOfDay_ts),
                where('timestamp', '<', prevDay_ts),
                limit(1000),
                orderBy('timestamp', 'desc')
            ));
        }
    }

    let rawData = [];
    for (let i = 0; i < weekLength; i++) {
        try {
            const querySnapshot = await getDocs(qArray[i]);
            rawData.push(querySnapshot.docs.map((doc) => doc.data()).reverse());
          } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
        
    return rawData;
};

function getWeekDateRange() {

    // Get date and its day index
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysAgo = today.getDay(); // get today's day of the week index (0-6)

    // Get the date for each day of the week
    let weekDays = [];
    let weekDaysTS = [];
    for (let i = 0; i < (daysAgo + 1); i++) {
        // Get each date for the week
        weekDays.push(new Date());
        weekDays[i].setDate(today.getDate() - i);
        weekDays[i].setHours(0, 0, 0, 0);

        // Add timestamp for firebase query
        weekDaysTS.push(Timestamp.fromDate(weekDays[i]));
    }

    return weekDaysTS;
}

export function getWeekDateNames() {
    
        // Get date and its day index
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const daysAgo = today.getDay(); // get today's day of the week index (0-6)
    
        // Get the date for each day of the week
        let weekDays = [];
        for (let i = 0; i < (daysAgo + 1); i++) {
            // Get each date for the week
            weekDays.push(new Date());
            weekDays[i].setDate(today.getDate() - i);
        }
    
        return weekDays;
}
  