import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IRecommendRecord } from 'app/shared/model/recommend-record.model';
import { RecommendRecordService } from './recommend-record.service';

@Component({
    selector: 'jhi-recommend-record-delete-dialog',
    templateUrl: './recommend-record-delete-dialog.component.html'
})
export class RecommendRecordDeleteDialogComponent {
    recommendRecord: IRecommendRecord;

    constructor(
        protected recommendRecordService: RecommendRecordService,
        public activeModal: NgbActiveModal,
        protected eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.recommendRecordService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'recommendRecordListModification',
                content: 'Deleted an recommendRecord'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-recommend-record-delete-popup',
    template: ''
})
export class RecommendRecordDeletePopupComponent implements OnInit, OnDestroy {
    protected ngbModalRef: NgbModalRef;

    constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ recommendRecord }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(RecommendRecordDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.recommendRecord = recommendRecord;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
