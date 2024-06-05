import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActuAgrePlantUserComponent } from './actu-agre-plant-user.component';

describe('ActuAgrePlantUserComponent', () => {
  let component: ActuAgrePlantUserComponent;
  let fixture: ComponentFixture<ActuAgrePlantUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActuAgrePlantUserComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActuAgrePlantUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
