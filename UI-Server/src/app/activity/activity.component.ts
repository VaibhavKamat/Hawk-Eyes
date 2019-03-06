import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  locations: any[]= [
    { status: "report_problem", location: 'Location A',time:" Few sec ago" },
    { status: "check_circle_outline", location: 'Location B',time:" 1 min ago" },
    { status: "check_circle_outline", location: 'Location C',time:" 4 min ago" },
    { status: "check_circle_outline", location: 'Location D',time:" 5 min  ago" },
    { status: "check_circle_outline", location: 'Location E',time:" 9 min ago" },

  ];;

  
  constructor() { }

  ngOnInit() {
  }

}
