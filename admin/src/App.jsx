import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock, faUserFriends, faAmbulance, faCog, faBars, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import Map from './components/Map/Map';
Chart.register(...registerables);

const EmergencyDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const emergencyStats = [
    { title: 'Active Emergencies', value: '23', icon: faAmbulance, color: 'bg-red-500' },
    { title: 'Avg Response Time', value: '4.2 mins', icon: faClock, color: 'bg-yellow-500' },
    { title: 'Total Responders', value: '1,543', icon: faUserFriends, color: 'bg-green-500' },
    { title: 'Resolved Cases', value: '89', icon: faMapMarkerAlt, color: 'bg-blue-500' },
  ];

  const responseTimeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Average Response Time (minutes)',
      data: [6.8, 5.5, 4.9, 4.5, 4.3, 4.1],
      borderColor: 'rgb(239, 68, 68)',
      tension: 0.1,
    }]
  };

  const incidentTypeData = {
    labels: ['Accidents', 'Medical', 'Natural Disaster', 'Other'],
    datasets: [{
      label: 'Incidents by Type',
      data: [65, 15, 10, 10],
      backgroundColor: ['#EF4444', '#3B82F6', '#10B981', '#94A3B8'],
    }]
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 z-50`}>
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">ReskU</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button onClick={() => setCurrentPage('dashboard')} 
                className={`w-full flex items-center p-3 rounded-lg ${currentPage === 'dashboard' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3" />
                Live Map
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('incidents')} 
                className={`w-full flex items-center p-3 rounded-lg ${currentPage === 'incidents' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}>
                <FontAwesomeIcon icon={faAmbulance} className="mr-3" />
                Active Incidents
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentPage('responders')} 
                className={`w-full flex items-center p-3 rounded-lg ${currentPage === 'responders' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}>
                <FontAwesomeIcon icon={faUserFriends} className="mr-3" />
                Responders
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`transition-margin duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            className="p-2 hover:bg-gray-100 rounded-lg">
            <FontAwesomeIcon icon={faBars} className="text-gray-600" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input type="text" placeholder="Search incidents..." 
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {/* Emergency Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {emergencyStats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-4 rounded-lg text-white`}>
                    <FontAwesomeIcon icon={stat.icon} size="lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Response Time Trends</h3>
              <Line data={responseTimeData} />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Live Incident Map</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500 relative overflow-hidden h-[100%] rounded-lg">
                  <Map />
                  {/* <FontAwesomeIcon icon={faMapMarkerAlt} className="text-3xl mb-2" />
                  <p>Real-time Mapbox Integration</p>
                  <p className="text-sm">Showing active emergencies and responders</p> */}
                </div>
              </div>
            </div>
          </div>

          {/* Incident Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recent Emergencies</h3>
              <button onClick={() => setIsReportModalOpen(true)} 
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center">
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Report New Incident
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Incident ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <tr key={item}>
                      <td className="px-6 py-4">#INC-{item}00{item}</td>
                      <td className="px-6 py-4">2.{item}km from center</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          item % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item % 2 === 0 ? 'Resolved' : 'Ongoing'}
                        </span>
                      </td>
                      <td className="px-6 py-4">{item * 3} responders</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-500 hover:text-blue-600 mr-4">Details</button>
                        <button className="text-red-500 hover:text-red-600">Escalate</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Incident Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Report New Emergency</h3>
              <button onClick={() => setIsReportModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Type</label>
                <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none">
                  <option>Road Accident</option>
                  <option>Medical Emergency</option>
                  <option>Natural Disaster</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" rows="3" />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setIsReportModalOpen(false)} 
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyDashboard;