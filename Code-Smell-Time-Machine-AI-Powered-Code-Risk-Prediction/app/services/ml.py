def train_model(feature_dicts: list[dict]) -> dict:
    if not feature_dicts:
        raise ValueError("No features to train on")
    return {"type": "heuristic_v3"}


def predict_risk(model: dict, feature_dict: dict) -> tuple[float, str]:
    total_churn = feature_dict.get("total_churn", 0)
    files_changed = feature_dict.get("files_changed", 0)
    message_length = feature_dict.get("message_length", 0)
    is_merge_commit = feature_dict.get("is_merge_commit", 0)

    # Simple heuristic: normalize to 0-1 with high thresholds
    # Most commits should be low-risk unless they have extreme changes

    # Churn score: 1000 lines = max risk
    churn_score = min(total_churn / 1000.0, 1.0)

    # Files score: 50 files = max risk
    files_score = min(files_changed / 50.0, 1.0)

    # Message score: very short messages are risky
    message_score = 0.0 if message_length >= 10 else 0.3

    # Weighted combination
    risk_score = (churn_score * 0.5) + (files_score * 0.3) + (message_score * 0.2)

    # Merge commits are safe
    if is_merge_commit:
        risk_score *= 0.3

    # Ensure 0-1 range
    risk_score = min(max(risk_score, 0.0), 1.0)

    # Label
    label = "high" if risk_score > 0.6 else "low"

    return risk_score, label
