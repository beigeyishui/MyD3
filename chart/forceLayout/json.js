let json = {
    "nodes": [
        {"id": 0, "name": "债卷A", "text": "债卷A(5000)", "date": "2017/3/1", "scale": 1},
        {"id": 1, "name": "债卷B", "text": "债卷B(5000)", "date": "2017/4/1", "scale": 2},
        {"id": 2, "name": "债卷C", "text": "债卷C(5000)", "date": "2017/5/1", "scale": 2},
        {"id": 3, "name": "债卷D", "text": "债卷D(5000)", "date": "2017/6/1", "scale": 2},
        {"id": 4, "name": "债卷E", "text": "债卷E(5000)", "date": "2017/7/1", "scale": 2},
        {"id": 5, "name": "债卷F", "text": "债卷F(5000)", "date": "2017/7/1", "scale": 4},
        {"id": 6, "name": "债卷G", "text": "债卷G(5000)", "date": "2017/7/1", "scale": 4},
    ],
    "links": [
        {"source": "0", "target": "1"},
        {"source": "0", "target": "2"},
        {"source": "0", "target": "3"},
        {"source": "0", "target": "4"},
        {"source": "4", "target": "5"},
        {"source": "1", "target": "5"},
        {"source": "2", "target": "6"},
    ]
};