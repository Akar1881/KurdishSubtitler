import { EventData, Frame, Page, Observable } from '@nativescript/core';
import { PermissionsService } from './shared/permissions/permissions.service';

export function navigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new WelcomeViewModel();
}

class WelcomeViewModel extends Observable {
    private _isCheckingPermissions = false;

    constructor() {
        super();
        this.checkPermissions();
    }

    get isCheckingPermissions(): boolean {
        return this._isCheckingPermissions;
    }

    private async checkPermissions(): Promise<void> {
        this._isCheckingPermissions = true;
        this.notifyPropertyChange('isCheckingPermissions', true);

        const result = await PermissionsService.checkAllFilesAccess();
        if (result.granted) {
            Frame.topmost().navigate('main-page');
        }

        this._isCheckingPermissions = false;
        this.notifyPropertyChange('isCheckingPermissions', false);
    }

    async onGetStarted() {
        if (this._isCheckingPermissions) return;

        const granted = await PermissionsService.requestAllFilesAccess();
        if (granted) {
            Frame.topmost().navigate('main-page');
        }
    }
}