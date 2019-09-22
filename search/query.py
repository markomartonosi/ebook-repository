def construct_query(query, filters):
    data = {
        "query": {
            "bool": {
                "should": [
                    {
                        "match": {
                            "title": {
                                "query": query,
                                "fuzziness": "AUTO",
                                "boost": 6
                            }

                        }
                    },
                    {
                        "match": {
                            "keywords": {
                                "query": query,
                                "boost": 3
                            }

                        }
                    },
                    {
                        "multi_match": {
                            "query": query,
                            "type": "best_fields",
                            "fields": [
                                "content.sr",
                                "content.en"
                            ]
                        }
                    }
                ],
                "filter": construct_filters(filters),
            }
        },
        "highlight": {
            "fields": {
                "title": {},
                "keywords": {},
                "content.sr": {"number_of_fragments": 1},
                "content.en": {"number_of_fragments": 1},
            }
        }
    }
    return data


def construct_es_query(query, filters):
    if query != "":
        data = construct_query(query, filters)
    else:
        if filters != "":
            data = {
                "query": {
                    "bool": {
                        "must": [{"match_all": {}}],
                        "filter": construct_filters(filters),
                    }
                }
            }

    return data


def construct_filters(filters):
    json_filters = []
    for filter_name in filters:
        filter_name_values_json = []
        for filter_values in filters[filter_name]:
            if filter_name in ("language", "category"):
                filter_name_values_json.append(
                    {
                        "match": {
                            f"{filter_name}.name": {
                                "query": filter_values,
                                "zero_terms_query": "none",
                            }
                        }
                    }
                )
            else:
                filter_name_values_json.append(
                    {
                        "match": {
                            filter_name: {
                                "query": filter_values,
                                "zero_terms_query": "none",
                            }
                        }
                    }
                )

        print(json_filters)
        json_filters.append({"bool": {"should": filter_name_values_json}})

    return json_filters
