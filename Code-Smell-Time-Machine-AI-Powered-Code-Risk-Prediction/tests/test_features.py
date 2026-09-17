import pytest
from app.services.features import extract_features


class TestExtractFeatures:
    def test_normal_commit(self):
        commit = {
            "additions": 50,
            "deletions": 30,
            "files_changed": 5,
            "message": "Fix bug in authentication",
        }

        features = extract_features(commit)

        assert features["additions"] == 50.0
        assert features["deletions"] == 30.0
        assert features["total_churn"] == 80.0
        assert features["files_changed"] == 5.0
        assert features["message_length"] == 27.0
        assert features["is_merge_commit"] == 0.0
        assert features["avg_churn_per_file"] == 16.0

    def test_merge_commit(self):
        commit = {
            "additions": 100,
            "deletions": 50,
            "files_changed": 10,
            "message": "Merge pull request #123 from feature/branch",
        }

        features = extract_features(commit)

        assert features["is_merge_commit"] == 1.0
        assert features["total_churn"] == 150.0

    def test_zero_files_changed(self):
        commit = {
            "additions": 0,
            "deletions": 0,
            "files_changed": 0,
            "message": "Empty commit",
        }

        features = extract_features(commit)

        assert features["files_changed"] == 0.0
        assert features["total_churn"] == 0.0
        assert features["avg_churn_per_file"] == 0.0

    def test_empty_message(self):
        commit = {
            "additions": 10,
            "deletions": 5,
            "files_changed": 2,
            "message": "",
        }

        features = extract_features(commit)

        assert features["message_length"] == 0.0

    def test_large_churn_commit(self):
        commit = {
            "additions": 500,
            "deletions": 300,
            "files_changed": 50,
            "message": "Major refactor",
        }

        features = extract_features(commit)

        assert features["total_churn"] == 800.0
        assert features["avg_churn_per_file"] == 16.0
