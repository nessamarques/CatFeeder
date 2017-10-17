import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'chart', 
  templateUrl: 'chart.component.html'
})

export class ChartComponent implements OnInit {

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
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    
    public lineChartLegend:boolean = true;
    public lineChartType:string = 'line';
    
    public randomize():void {
        let _lineChartData:Array<any> = new Array(this.lineChartData.length);
        for (let i = 0; i < this.lineChartData.length; i++) {
            _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
            for (let j = 0; j < this.lineChartData[i].data.length; j++) {
                _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
            }
        }
        this.lineChartData = _lineChartData;
    }
    
    // events
    public chartClicked(e:any):void {
        console.log("chartClicked");
        console.log(e);
    }
    
    public chartHovered(e:any):void {
        console.log("chartHovered");
        console.log(e);
    }
}