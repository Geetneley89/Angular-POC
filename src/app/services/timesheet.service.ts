import { Injectable } from '@angular/core';

@Injectable()
export class TimeSheetService {

    submittedTimesheet;
    submittedTimesheetCount;
    constructor() { }

    get data(): any {
        return this.submittedTimesheet;
    }

    set data(val: any) {
        this.submittedTimesheet = val;
    }

    get count(): number {
        return this.submittedTimesheetCount;
    }

    set count(val: number) {
        this.submittedTimesheetCount = val;
    }

}