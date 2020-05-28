import { Component, OnInit, OnDestroy } from '@angular/core';
import { BedService } from '../bed.service';
import { Bed } from '../models/bed';
import { timer, Subscription, of } from 'rxjs';
import { switchMap, map, tap, catchError } from 'rxjs/operators';


@Component({
	selector: 'app-beds',
	templateUrl: './beds.page.html',
	styleUrls: ['./beds.page.scss'],
})
export class BedsPage implements OnInit, OnDestroy {

	beds: Bed[];
	private readonly POLL_MS = 5000;
	private bedPoller: Subscription;

	constructor(
		private bedService: BedService
	) { }

	ngOnInit(): void {
		
	}

	ngOnDestroy(): void {
		
	}
	
	ionViewDidLeave(): void {
		console.log("destroying beds");
		this.bedPoller && this.bedPoller.unsubscribe();
	}

	ionViewDidEnter() {
		console.log("starting beds poll");
		this.bedPoller = timer(0, this.POLL_MS)
		.pipe(
			switchMap(() => this.bedService.getBeds()),
			tap(beds => {
				beds.forEach(bed => {
					bed.status = Math.floor(Math.random() * 3);
				})
				this.beds = beds;
			}),
			catchError(err => {
				console.log(err);
				return of(null);
			})
		)
		.subscribe();
	}
}
