import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { setClassMetadata } from '@angular/core/src/r3_symbols';

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

  constructor(private http: HttpClient, private alertController: AlertController) { }
  
  async getInfo() {

    this.searchString = this.searched;
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
  }

  async unrecognizedLocation() {
        const alert = await this.alertController.create({
          header: 'Alert',
          subHeader: 'Unrecognized Location',
          message: 'We were un able to find the specified country. Please try again.',
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
}
