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
    for (op, data) in diffs:
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
                            "message": {"$ne": "assist"},
                            "state": {"$ne": "user_selection"},
                            'revision': {"$ne": []},
                            })
    actions = []
    for each in data:
        actions.append({"file": each["file"], "username": each['username'], "timestamp": each["timestamp"]})


def generate(projectID, writer_action_idx):
    text_array = []
    diffs_htmls = []
    users = []
    data = collection.find({'project': projectID,
                            "message": {"$ne": "assist"},
                            "state": {"$ne": "user_selection"},
                            'revision': {"$ne": []},
                            })

    for j in range(writer_action_idx, writer_action_idx + 2):
        text_array.append(data[j]['text'])

    diffs = dmp.diff_main(text_array[0]['text'], text_array[1]['text'])
    dmp.diff_cleanupSemantic(diffs)
    diffs_htmls.append(diff_prettyHtml(diffs))

    info = []
    print(len(users))
    print(len(actions))
    print(len(diffs_htmls))

    for i in range(0, len(users)):
        try:
            if i == 0:
                info.append({"users": users[i], "actions": actions[i], "htmls": actions[0]['text']})
            if i > 0:
                info.append({"users": users[i], "actions": actions[i], "htmls": diffs_htmls[i - 1]})
        except:
            break
    return writer_action_idx, writer_action_idx + num_action_send, info