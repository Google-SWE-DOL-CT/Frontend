import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-viewer',
  templateUrl: './new-viewer.component.html',
  styleUrls: ['./new-viewer.component.css']
})
export class NewViewerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  inviteUser(): void {
    alert("Invited!")
  }

}
