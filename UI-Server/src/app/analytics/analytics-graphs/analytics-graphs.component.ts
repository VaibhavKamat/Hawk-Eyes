import { Component, OnInit } from '@angular/core';
import * as c3 from 'c3';

@Component({
  selector: 'app-analytics-graphs',
  templateUrl: './analytics-graphs.component.html',
  styleUrls: ['./analytics-graphs.component.scss']
})
export class AnalyticsGraphsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
      let linegraph = c3.generate({
      bindto: '#linegraph',
          data: {
              columns: [
                  ['data1', 30, 200, 100, 400, 150, 250],
                  ['data2', 50, 20, 10, 40, 15, 25]
              ]
          }
      });


      let piechart= c3.generate({
          bindto: '#piechart',
          data: {
              // iris data from R
                columns: [
                  ['data1', 30],
                  ['data2', 120],
              ],
              type: 'pie'
          },
          color: {
              pattern: ['#F8E59B', '#7DD3AE']
          },
          legend: {
              position: 'bottom'
          },
          pie: {
              label: {
                  show: false
              }
          }
      });
     
    /*
    columns: [
            ['x', '2019-02-22', '2019-02-23', '2019-02-24', '2019-02-25', '2019-02-26', '2019-02-27', '2019-02-28', '2019-03-01', '2019-03-02', '2019-03-03', '2019-03-04', '2019-03-05', '2019-03-06', '2019-03-07', '2019-03-08'],
            ['true-positive', 10, 15, 20, 40, 60, 80, 100, 125, 150, 175, 200, 250, 220, 200, 150],
            ['false-positive', 20, 22, 26, 52, 65, 79, 96, 110, 130, 120, 120, 100, 70, 55, 35]
        ],
        
    */
    let combinegraph1= c3.generate({
      bindto: '#combinegraph',
      data: {
        x: 'x',
        type: 'bar',
        columns: [
            ['x', '2019-02-22', '2019-02-23', '2019-02-24', '2019-02-25', '2019-02-26'],
            ['true-positive', 10, 15, 20, 40, 60],
            ['false-positive', 20, 22, 26, 52, 65]
        ],
        
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: '%Y-%m-%d'
            }
        }
    }
});
  }

}
