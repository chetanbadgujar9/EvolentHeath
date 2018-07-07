import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
/**
 * This class represents the toolbar component.
 */
@Component({
    moduleId: module.id,
    selector: 'app-unauthorized',
    templateUrl: 'unauthorized.component.html',
    styleUrls: ['unauthorized.component.css'],
})
export class UnAuthorizedComponent implements OnInit {
    show: boolean = false;
    params: Params;
    constructor(private router: Router, private route: ActivatedRoute
    ) { }
    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.params = params['id'];
            console.log(this.params)
        });
    }
}
