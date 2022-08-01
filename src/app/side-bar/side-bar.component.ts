import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  user!: User
  renderJF!: boolean;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    ) { }


  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log("Navpage: " + id)
    if (id) {
      console.log("side bar init")
      this.renderJF = true;
      this.userService.getSingleUser(id).subscribe({
        next: data => {
          this.user = data
        }
      }
        // data => this.user = data,
      )
    } else {
      this.renderJF = false;
    }
  }

  collapsed = true;

  toggle() {
    this.collapsed = !this.collapsed;
  }

  expand() {
    this.collapsed = false;
  }

  collapse() {
    this.collapsed = true;
  }

}
