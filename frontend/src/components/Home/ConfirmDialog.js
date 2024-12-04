import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

/**
 * 삭제 확인 다이얼로그 컴포넌트
 *
 * @param {boolean} open - 다이얼로그 열림 상태
 * @param {string} title - 다이얼로그 제목
 * @param {string} content - 다이얼로그 내용
 * @param {function} onClose - 다이얼로그 닫기 핸들러
 * @param {function} onConfirm - 삭제 확인 핸들러
 */
function ConfirmDialog({ open, title, content, onClose, onConfirm }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
        >
            <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    취소
                </Button>
                <Button onClick={onConfirm} color="error" autoFocus>
                    삭제
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;