import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'chart', 
  templateUrl: 'chart.component.html',
  styleUrls: ['./chart.component.css']
})

export class ChartComponent implements OnInit {
    @Input()
    series: Array<any> = [];
    @Input()
    labels: Array<string> = [];
    ngOnInit(): void {
    }

    // TODO: Get AWS Data
    public lineChartData:Array<any> = [
        {data: [4, 3, 4, 2], label: 'Times'},
    ];

    // TODO: Get AWS Dates and times
    public lineChartLabels:Array<any> = ['10/14', '10/15', '10/16', '10/17'];
    
    public lineChartOptions:any = {
        responsive: true
    };
    
    public lineChartColors:Array<any> = [
        {
            backgroundColor: 'rgba(148,159,177,1)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    
    public lineChartLegend:boolean = true;
    public lineChartType:string = 'bar';
      
}