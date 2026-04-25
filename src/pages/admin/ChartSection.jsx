<section className="w-full max-w-full overflow-x-hidden grid grid-cols-1 gap-4 lg:grid-cols-2">

  {/* ================= Revenue Trend ================= */}
  <div className="bg-white rounded-xl shadow-sm p-4 w-full overflow-hidden">
    <div className="flex items-center justify-between mb-2">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">
          Revenue Trend
        </h3>
        <p className="text-xs text-gray-500">
          Last 7 days revenue
        </p>
      </div>

      <button className="p-2 rounded-md hover:bg-gray-100">
        <Eye size={16} />
      </button>
    </div>

    <div className="relative w-full h-[220px] sm:h-[260px] overflow-hidden">
      <Line
        data={{
          labels: [
            'Day 1',
            'Day 2',
            'Day 3',
            'Day 4',
            'Day 5',
            'Day 6',
            'Today'
          ],
          datasets: [
            {
              label: 'Revenue',
              data: dashboardData.revenueTrend,
              borderColor: '#3C50E0',
              backgroundColor: 'rgba(60, 80, 224, 0.1)',
              borderWidth: 2,
              tension: 0.4,
              fill: true,
              pointRadius: 3,
              pointHoverRadius: 4
            }
          ]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `₹${value}`,
                maxTicksLimit: 5,
                font: { size: 11 }
              },
              grid: {
                color: 'rgba(0,0,0,0.05)'
              }
            },
            x: {
              ticks: {
                font: { size: 11 }
              },
              grid: { display: false }
            }
          }
        }}
      />
    </div>
  </div>

  {/* ================= Orders by Status ================= */}
  <div className="bg-white rounded-xl shadow-sm p-4 w-full overflow-hidden">
    <div className="mb-2">
      <h3 className="text-sm font-semibold text-gray-800">
        Orders by Status
      </h3>
      <p className="text-xs text-gray-500">
        Current order distribution
      </p>
    </div>

    <div className="relative w-full h-[220px] sm:h-[260px] overflow-hidden">
      <Bar
        data={{
          labels: [
            'Placed',
            'Confirmed',
            'Shipped',
            'Delivered',
            'Cancelled'
          ],
          datasets: [
            {
              data: [
                dashboardData.orderStatusCount.placed,
                dashboardData.orderStatusCount.confirmed,
                dashboardData.orderStatusCount.shipped,
                dashboardData.orderStatusCount.delivered,
                dashboardData.orderStatusCount.cancelled
              ],
              backgroundColor: [
                '#94A3B8',
                '#3B82F6',
                '#F59E0B',
                '#10B981',
                '#EF4444'
              ],
              borderRadius: 6,
              maxBarThickness: 36
            }
          ]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: { size: 11 },
                maxTicksLimit: 5
              },
              grid: {
                color: 'rgba(0,0,0,0.05)'
              }
            },
            x: {
              ticks: {
                font: { size: 11 }
              },
              grid: { display: false }
            }
          }
        }}
      />
    </div>
  </div>

</section>
