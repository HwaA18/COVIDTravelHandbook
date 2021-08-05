import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { setClassMetadata } from '@angular/core/src/r3_symbols';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  searched: String;
  searchString: String;
  lat: number;
  long: number;
  showResults: boolean;
  covidData: any = false;
  totalCases: number;
  newCases: number;
  deaths: number;
  newDeaths: number;
  recovered: number;
  active: number;
  critical: number;
  casesPer1Mill: number;

  today: any;

  news = [];

  constructor(private http: HttpClient, private alertController: AlertController, private datePipe: DatePipe) {
    this.today = new Date();
    this.today = this.datePipe.transform(this.today, 'yyyy-MM-dd');
  }
  
  async getInfo() {
    
    if(this.searched.length > 0) {
      this.searchString = this.searched.charAt(0).toUpperCase() + this.searched.substr(1).toLowerCase()
    } else { this.searchString = this.searched; }
    
    let httpString = "https://coronavirus-19-api.herokuapp.com/countries/" + this.searchString;

    /*await this.http.get(httpString).subscribe((response) => {
      this.covidData = response;
      //console.log(response);
    }); */

    try {
      const response = await fetch(httpString);
      const json = await response.json();
      //console.log(json);

      this.covidData = json;
      this.showResults = true;
    } catch (error) {
      console.log(error)
      this.unrecognizedLocation();
    } finally {}

    console.log(this.covidData)
    
    this.totalCases = this.covidData['cases'];
    this.newCases = this.covidData['todayCases'];
    this.deaths = this.covidData['deaths'];
    this.newDeaths = this.covidData['todayDeaths'];;
    this.recovered = this.covidData['recovered'];;
    this.active = this.covidData['active'];;
    this.critical = this.covidData['critical'];;
    this.casesPer1Mill = this.covidData['casesPerOneMillion'];;

    this.getNews();
  }

  async unrecognizedLocation() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Unrecognized Location',
      message: 'We were unable to find the specified country. Please try again.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
          //this.startOver();
          }
          }
        ]
      });
    
    await alert.present();
  }

  async getNews() {

    let httpString = "https://newsapi.org/v2/everything?q=" + this.searchString + "+Border+Opening&from=" + this.today
        + "&sortBy=popularity&apiKey=8271d2433d1b43db9c6d0737bb94ad06";

    console.log(httpString);

    try {
      /* Fetch our data */
      const response = await fetch(httpString);
      const json = await response.json();

      /* Put data into readable array */
      var outputArray = []
      for (let element in json) {  
        outputArray.push({  
          id: element,  
          name: json[element]  
        });  
      }  

      console.log(this.news);

      /* Create a new array with all of the {} objects */
      var res = [];
      for (var x in outputArray[2]['name']){
        res.push(outputArray[2]['name'][x])
        //console.log("x type: " + outputArray[2]['name'][x]['title']);
      }
      console.log(res);

      this.news = res;
    } catch (error) {

      console.log(error);

    } finally {} 

  }
  
  openWindow(url) {
    window.open(url, '_system', 'location=yes');
  }
}
