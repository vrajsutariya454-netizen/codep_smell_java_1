def extract_features(commit: dict) -> dict:
    additions = commit.get("additions", 0)
    deletions = commit.get("deletions", 0)
    files_changed = commit.get("files_changed", 0)
    message = commit.get("message", "")

    total_churn = additions + deletions
    avg_churn_per_file = (
        total_churn / files_changed if files_changed > 0 else total_churn
    )
    message_length = len(message)
    is_merge_commit = 1 if message.lower().startswith("merge") else 0

    return {
        "additions": float(additions),
        "deletions": float(deletions),
        "total_churn": float(total_churn),
        "files_changed": float(files_changed),
        "message_length": float(message_length),
        "is_merge_commit": float(is_merge_commit),
        "avg_churn_per_file": float(avg_churn_per_file),
    }
