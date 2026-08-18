export const MOCK_DATA = {
  "Today": {
    revenue: "1,250,000", revTrend: "+5.2%", revUp: true,
    visits: 12, visitsTrend: "+2", visitsUp: true,
    cancels: 1, cancelsTrend: "Normal",
    wait: "2 min", waitTrend: "-1 min", waitUp: true,
    insight: {
      type: "success",
      title: "Great start to the day",
      desc: "Morning capacity is 15% higher than usual. Complex bundle services are generating the majority of revenue."
    },
    chartData: [
      { label: "10:00", value: 20 }, { label: "12:00", value: 60 }, { label: "14:00", value: 90 }, 
      { label: "16:00", value: 40 }, { label: "18:00", value: 100 }, { label: "20:00", value: 30 }
    ],
    services: [
      { id: 1, name: "Haircut + Beard", visits: 8, revenue: "960,000 UZS" },
      { id: 2, name: "Men's Haircut", visits: 4, revenue: "290,000 UZS" },
    ]
  },
  "Week": {
    revenue: "8,400,000", revTrend: "-2.1%", revUp: false,
    visits: 86, visitsTrend: "-4", visitsUp: false,
    cancels: 5, cancelsTrend: "+2",
    wait: "5 min", waitTrend: "+1 min", waitUp: false,
    insight: {
      type: "warning",
      title: "Evening cancellations increased",
      desc: "5 appointments were cancelled this week (mostly after 18:00). We recommend enabling SMS reminders 2 hours before the visit."
    },
    chartData: [
      { label: "Mon", value: 40 }, { label: "Tue", value: 35 }, { label: "Wed", value: 50 }, 
      { label: "Thu", value: 80 }, { label: "Fri", value: 95 }, { label: "Sat", value: 100 }, { label: "Sun", value: 85 }
    ],
    services: [
      { id: 1, name: "Haircut + Beard", visits: 45, revenue: "5,400,000 UZS" },
      { id: 2, name: "Men's Haircut", visits: 31, revenue: "2,480,000 UZS" },
      { id: 3, name: "Kids' Haircut", visits: 10, revenue: "520,000 UZS" },
    ]
  },
  "Month": {
    revenue: "32,150,000", revTrend: "+14.8%", revUp: true,
    visits: 342, visitsTrend: "+45", visitsUp: true,
    cancels: 12, cancelsTrend: "-5",
    wait: "4 min", waitTrend: "-3 min", waitUp: true,
    insight: {
      type: "success",
      title: "Record monthly revenue",
      desc: "By reducing wait times (down to 4 min), salon throughput increased by 15%. Excellent team performance!"
    },
    chartData: [
      { label: "Week 1", value: 70 }, { label: "Week 2", value: 85 }, 
      { label: "Week 3", value: 80 }, { label: "Week 4", value: 100 }
    ],
    services: [
      { id: 1, name: "Haircut + Beard", visits: 180, revenue: "21,600,000 UZS" },
      { id: 2, name: "Men's Haircut", visits: 120, revenue: "9,600,000 UZS" },
      { id: 3, name: "Grey Camouflage", visits: 42, revenue: "950,000 UZS" },
    ]
  }
};

