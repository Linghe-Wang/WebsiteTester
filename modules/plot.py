from .utils import *

import matplotlib.pyplot as plt
from itertools import cycle

#
# def generate_category_colors(num_categories):
#     if not isinstance(num_categories, int) or num_categories <= 0:
#         raise ValueError("Number of categories must be a positive integer.")
#
#     # Use matplotlib's default color cycle to generate distinct colors
#     color_cycle = cycle(plt.rcParams['axes.prop_cycle'].by_key()['color'])
#
#     # Generate a list of distinct colors based on the number of categories
#     colors = [next(color_cycle) for _ in range(num_categories)]
#
#     return colors


def plot_stack_chart(chart_data):
    dates = []
    pids = []

    for key in chart_data:
        dates.append(key)

    for date in dates:
        try:
            for pid in chart_data[date][1]:
                if (pid not in pids) and (pid != "null"):
                    pids.append(pid)
        except IndexError:
            continue

    bar_data = []
    # stack_color = generate_category_colors(len(pids))
    for pid in pids:
        edits = []
        for date in dates:
            try:
                if pid in chart_data[date][1]:
                    edits.append(chart_data[date][1][pid])
                else:
                    edits.append(0)
            except IndexError:
                edits.append(0)
        bar_data.append(edits)

    graph_data = {'labels': dates, 'datasets': []}
    # for i in range(len(bar_data)):
    #     bar = {'label': pids[i], 'data': bar_data[i], 'backgroundColor': stack_color[i], 'borderWidth': 0}
    #     graph_data['datasets'].append(bar)

    for i in range(len(bar_data)):
        bar = {'label': pids[i], 'data': bar_data[i], 'borderWidth': 0}
        graph_data['datasets'].append(bar)

    return graph_data


def plot_chart(chart_data):
    try:
        chart_data = chart_data[0]
    except IndexError:
        chart_data = []

    labels = []
    bar_data = []
    console.log(chart_data)
    for key in chart_data:
        if key != "null":
            labels.append(key)
            bar_data.append(chart_data[key])

    # stack_color = generate_category_colors(len(labels))

    graph_data = {'labels': labels, 'datasets': []}
    # bar = {'data': bar_data, 'backgroundColor': stack_color, 'borderWidth': 0}
    bar = {'data': bar_data, 'borderWidth': 0}
    graph_data['datasets'].append(bar)

    return graph_data