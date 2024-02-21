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


# def load_file_meta_data(projectID, skip=0):
#     data = collection.find({'project': projectID,
#                             "message": {"$exists": True, "$ne": "assist"},
#                             "state": {"$exists": True, "$ne": "user_selection"},
#                             'revision': {"$exists": True, "$ne": []},
#                             'line': {"$exists": True, "$ne": ""},
#                             'editingLines': {"$exists": True, "$ne": []}
#                             }).sort("timestamp", 1).limit(500)
#     actions = []
#     revisions = []
#     for each in data:
#         timestamp = datetime.fromtimestamp(each["timestamp"]/1000).strftime('%Y-%m-%d %H:%M:%S')
#         actions.append({"file": each["file"], "username": each['username'], "timestamp": timestamp})
#         revisions.append({"line_nums": each["editingLines"], "diff_html": diff_prettyHtml(each["revision"])})
#
#     # "actions" contains filename, username, and time for each frame
#     # "revisions" contains line number and difference HTML(HTML for text reconstruction)
#     return {"actions": actions, "revisions": revisions}


def initialize_admin_data(projectID):
    console.log(projectID)
    query = {'project': projectID,
             "file": {"$exists": True},
            "message": {"$exists": True, "$ne": "assist"},
            "state": {"$exists": True, "$ne": "user_selection"},
            'revision': {"$exists": True, "$ne": []},
            'line': {"$exists": True, "$ne": ""},
            'editingLines': {"$exists": True, "$ne": []}
            }

    data = collection.find(query).sort("timestamp", 1).skip(0).limit(500)

    filenames = collection.distinct("file", query)
    console.log(filenames)
    no_of_doc = collection.count_documents(query)

    no_of_doc_file = {}
    for filename in filenames:
        doc_count = collection.count_documents({'project': projectID, 'file': filename,
                "message": {"$exists": True, "$ne": "assist"},
                "state": {"$exists": True, "$ne": "user_selection"},
                'revision': {"$exists": True, "$ne": []},
                'line': {"$exists": True, "$ne": ""},
                'editingLines': {"$exists": True, "$ne": []}
                })
        no_of_doc_file[filename] = doc_count

    actions = []
    revisions = []
    for each in data:
        timestamp = datetime.fromtimestamp(each["timestamp"]/1000).strftime('%Y-%m-%d %H:%M:%S')
        actions.append({"file": each["file"], "username": each['username'], "timestamp": timestamp})
        if len(each["revision"]) < 6:
            revisions.append({"line_nums": each["editingLines"], "diff_html": diff_prettyHtml(each["revision"])})
        else:
            before, after = [], []
            for section in each["revision"]:
                if section[0] == 0 or section[0] == -1:
                    before.append(section)
                if section[0]== 0 or section[0] == 1:
                    after.append(section)
            actions.append({"file": each["file"], "username": each['username'], "timestamp": timestamp})
            revisions.append({"line_nums": each["editingLines"], "diff_html": diff_prettyHtml(before)})
            revisions.append({"line_nums": each["editingLines"], "diff_html": diff_prettyHtml(after)})

    # "actions" contains filename, username, and time for each frame
    # "revisions" contains line number and difference HTML(HTML for text reconstruction)
    return {"no_of_doc": no_of_doc, "no_of_doc_file": no_of_doc_file ,
            "filenames": filenames, "actions": actions, "revisions": revisions}


def load_chunk_by_time(projectID, skip):
    if skip > 100:
        skip = skip-100
    else:
        skip = 0

    data = collection.find({'project': projectID,
                            "file": {"$exists": True},
                            "message": {"$exists": True, "$ne": "assist"},
                            "state": {"$exists": True, "$ne": "user_selection"},
                            'revision': {"$exists": True, "$ne": []},
                            'line': {"$exists": True, "$ne": ""},
                            'editingLines': {"$exists": True, "$ne": []}
                            }).sort("timestamp", 1).skip(skip).limit(200)

    actions = []
    revisions = []
    for each in data:
        timestamp = datetime.fromtimestamp(each["timestamp"]/1000).strftime('%Y-%m-%d %H:%M:%S')
        actions.append({"file": each["file"], "username": each['username'], "timestamp": timestamp})
        if len(each["revision"]) < 6:
            revisions.append({"line_nums": each["editingLines"], "diff_html": diff_prettyHtml(each["revision"])})
        else:
            before, after = [], []
            for section in each["revision"]:
                if section[0] == 0 or section[0] == -1:
                    before.append(section)
                if section[0]== 0 or section[0] == 1:
                    after.append(section)
            actions.append({"file": each["file"], "username": each['username'], "timestamp": timestamp})
            revisions.append({"line_nums": each["editingLines"], "diff_html": diff_prettyHtml(before)})
            revisions.append({"line_nums": each["editingLines"], "diff_html": diff_prettyHtml(after)})
    return {"actions": actions, "revisions": revisions, "min": skip, "max": skip+200}


def load_chunk_by_file(projectID, skip, file):
    if skip > 100:
        skip = skip-100
    else:
        skip = 0

    data = collection.find({'project': projectID,
                            "file": file,
                            "message": {"$exists": True, "$ne": "assist"},
                            "state": {"$exists": True, "$ne": "user_selection"},
                            'revision': {"$exists": True, "$ne": []},
                            'line': {"$exists": True, "$ne": ""},
                            'editingLines': {"$exists": True, "$ne": []}
                            }).sort("timestamp", 1).skip(skip).limit(200)

    actions = []
    revisions = []
    for each in data:
        timestamp = datetime.fromtimestamp(each["timestamp"]/1000).strftime('%Y-%m-%d %H:%M:%S')
        actions.append({"file": each["file"], "username": each['username'], "timestamp": timestamp})
        if len(each["revision"]) < 6:
            revisions.append({"line_nums": each["editingLines"], "diff_html": diff_prettyHtml(each["revision"])})
        else:
            before, after = [], []
            for section in each["revision"]:
                if section[0] == 0 or section[0] == -1:
                    before.append(section)
                if section[0]== 0 or section[0] == 1:
                    after.append(section)
            actions.append({"file": each["file"], "username": each['username'], "timestamp": timestamp})
            revisions.append({"line_nums": each["editingLines"], "diff_html": diff_prettyHtml(before)})
            revisions.append({"line_nums": each["editingLines"], "diff_html": diff_prettyHtml(after)})
    return {"actions": actions, "revisions": revisions, "min": skip, "max": skip+200}