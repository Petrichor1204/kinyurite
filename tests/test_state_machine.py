import pytest
from app.models.branch import BranchStatus, is_valid_transition

def test_draft_to_submitted_is_valid():
    assert is_valid_transition(BranchStatus.DRAFT, BranchStatus.SUBMITTED) == True

def test_submitted_to_under_review_is_valid():
    assert is_valid_transition(BranchStatus.SUBMITTED, BranchStatus.UNDER_REVIEW) == True

def test_under_review_to_merged_is_valid():
    assert is_valid_transition(BranchStatus.UNDER_REVIEW, BranchStatus.MERGED) == True

def test_under_review_to_rejected_is_valid():
    assert is_valid_transition(BranchStatus.UNDER_REVIEW, BranchStatus.REJECTED) == True

def test_draft_to_merged_is_invalid():
    assert is_valid_transition(BranchStatus.DRAFT, BranchStatus.MERGED) == False

def test_draft_to_under_review_is_invalid():
    assert is_valid_transition(BranchStatus.DRAFT, BranchStatus.UNDER_REVIEW) == False

def test_draft_to_rejected_is_invalid():
    assert is_valid_transition(BranchStatus.DRAFT, BranchStatus.REJECTED) == False

def test_submitted_to_merged_is_invalid():
    assert is_valid_transition(BranchStatus.SUBMITTED, BranchStatus.MERGED) == False

def test_submitted_to_rejected_is_invalid():
    assert is_valid_transition(BranchStatus.SUBMITTED, BranchStatus.REJECTED) == False

def test_merged_is_terminal():
    assert is_valid_transition(BranchStatus.MERGED, BranchStatus.SUBMITTED) == False
    assert is_valid_transition(BranchStatus.MERGED, BranchStatus.DRAFT) == False
    assert is_valid_transition(BranchStatus.MERGED, BranchStatus.UNDER_REVIEW) == False

def test_rejected_is_terminal():
    assert is_valid_transition(BranchStatus.REJECTED, BranchStatus.SUBMITTED) == False
    assert is_valid_transition(BranchStatus.REJECTED, BranchStatus.DRAFT) == False
    assert is_valid_transition(BranchStatus.REJECTED, BranchStatus.UNDER_REVIEW) == False