import { query, orderBy, limit, where, getDocs, Timestamp } from 'firebase/firestore';


export async function fetchWeekData( actRef ) {

    // Get the date at the start of the week for date range
    const startOfDay = getWeekDateRange();

    // Set both to start of the day
    // startOfWeek.setHours(0, 0, 0, 0);
    // startOfDay.setHours(0, 0, 0, 0);

    // console.log('startOfWeek:', startOfWeek);
    console.log('startOfDay:', startOfDay);

    // Convert to Timestamp
    // const startOfWeek_timestamp = Timestamp.fromDate(startOfWeek)
    const startOfDay_timestamp = Timestamp.fromDate(startOfDay)

    // init data variable
    var rawData = [];

    // Setup the query the database for the week
    const q = query(
      actRef,
      where('timestamp', '>=', startOfDay_timestamp),
      limit(1000),
      orderBy('timestamp', 'desc')
    );
        
    // Query the database
    try {
      const querySnapshot = await getDocs(q);
      rawData = querySnapshot.docs.map((doc) => doc.data()).reverse();
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    return rawData;
};

// function getDaysUntil(day) {
//     const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     const index = weekDays.indexOf(day);
  
//     if (index !== -1) {
//       return weekDays.slice(0, index + 1);
//     } else {
//       return [];
//     }
// }
  
function getWeekDateRange() {

    // Get date and its day index
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysAgo = today.getDay(); // get today's day of the week index (0-6)

    // Get the date for each day of the week
    let weekDays = [];
    for (let i = 0; i < (daysAgo + 1); i++) {
        console.log('index:', i);
        weekDays.push(new Date());
        weekDays[i].setDate(today.getDate() - i);
        weekDays[i].setHours(0, 0, 0, 0);
        console.log('weekDays today:', weekDays[i]);
    }
    console.log('weekDays:', weekDays);
    console.log('today:', today);
    // const startOfWeek = new Date(today.getTime());
    // startOfWeek.setDate(today.getDate() - daysAgo);

    return today; // { startOfWeek, today };
}
  