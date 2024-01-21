import diff_match_patch as dmp_module
from .utils import *

dmp = dmp_module.diff_match_patch()


def diff_prettyHtml(diffs):
    """Convert a diff array into a pretty HTML report.

Args:
  diffs: Array of diff tuples.

Returns:
  HTML representation.
"""
    html = []
    for each in diffs:
        op, data = each[:2]
        text = (
            data.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\n", "&para;<br>")
        )
        if op == 1:
            html.append('<ins style="background:#82E0AA;">%s</ins>' % text)
        elif op == -1:
            html.append('<del style="background:#F1948A;">%s</del>' % text)
        elif op == 2:
            html.append('<del style="background:#C39BD3;">%s</del>' % text)
        elif op == 0:
            html.append("<span>%s</span>" % text)
    return "".join(html)


def load_file_meta_data(projectID):
    data = collection.find({'project': projectID,
                            "message": {"$exists": True, "$ne": "assist"},
                            "state": {"$exists": True, "$ne": "user_selection"},
                            'revision': {"$exists": True, "$ne": []},
                            'line': {"$exists": True, "$ne": ""},
                            'editingLines': {"$exists": True, "$ne": []}
                            }).sort("timestamp", 1).limit(500)
    actions = []
    revisions = []
    for each in data:
        timestamp = datetime.fromtimestamp(each["timestamp"]/1000).strftime('%Y-%m-%d %H:%M:%S')
        actions.append({"file": each["file"], "username": each['username'], "timestamp": timestamp})
        revisions.append({"line_nums": each["editingLines"], "diff_html": diff_prettyHtml(each["revision"])})

    # "actions" contains filename, username, and time for each frame
    # "revisions" contains line number and difference HTML(HTML for text reconstruction)
    return {"actions": actions, "revisions": revisions}
