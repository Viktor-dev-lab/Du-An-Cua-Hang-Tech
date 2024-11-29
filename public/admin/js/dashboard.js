document.addEventListener('DOMContentLoaded', function() {
    Chart.defaults.global.defaultFontFamily = "Roboto";
    let ctx = document.querySelector('#revenueChart').getContext('2d');

    let revChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Sept 1', 'Sept 3', 'Sept 6', 'Sept 9', 'Sept 12', 
                     'Sept 15', 'Sept 18', 'Sept 21', 'Sept 24', 'Sept 27', 'Sept 30'],
            datasets: [
                {
                    label: 'Views',
                    borderColor: 'green',
                    borderWidth: 3,
                    backgroundColor: 'rgba(235,247,245,0.7)',
                    data: [0, 30, 60, 25, 60, 25, 50, 10, 50, 90, 120]
                },
                {
                    label: 'Watch Times',
                    borderColor: 'blue',
                    borderWidth: 3,
                    backgroundColor: 'rgba(233,238,253,0.7)',
                    data: [0, 60, 25, 100, 20, 75, 30, 55, 20, 60, 20]
                }
            ]
        },
        options: {
            responsive: true,
            tooltips: {
                intersect: false,
                mode: 'index',
            }
        }
    });
});




// Phần sider xử lý khi nhấn vào trang khác
const activePage = window.location.pathname;
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    if (link.href.includes(`${activePage}`)) {
       link.classList.add('active');
    }
});







