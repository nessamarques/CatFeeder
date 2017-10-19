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
    
    public lineChartOptions:any = {
        responsive: true
    };
    
    public lineChartColors:Array<any> = [
        {
            backgroundColor: 'rgba(0,0,255,0.3)',
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