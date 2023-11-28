from config import KTT1_DATA_TAG, KTT2_DATA_TAG, RBG1_DATA_TAG, RBG2_DATA_TAG

DB_MAPPING = {
    KTT1_DATA_TAG: {
        'local': {
            'source': {
                'host': '127.0.0.1',
                'port': 13401,
                'username': 'root',
                'password': 'P@ssw0rd',
                'db_name': 'db_data_gateway',
                'tb_name': 'history',
            },
            'target': {
                'host': '35.219.48.62',
                'port': 3306,
                'username': 'smlds',
                'password': 'SMLds2021!',
                'db_name': 'db_bat_kaltim1',
            },
            # 'target': {
            #     'host': '127.0.0.1',
            #     'port': 13402,
            #     'username': 'root',
            #     'password': 'P@ssw0rd',
            #     'db_name': 'db_bat_kaltim1',
            # },
        },
        'server': {
            'source': {
                'host': '192.168.1.101',
                'username': 'root',
                'password': 'P@ssw0rd',
                'db_name': 'db_data_gateway',
                'port': 3306,
                'tb_name': 'history',
            },
            'target': {
                'host': '192.168.0.105',
                'username': 'root',
                'password': 'P@ssw0rd',
                'db_name': 'db_bat_kaltim1',
                'port': 3306,
            },
        },
    },
    KTT2_DATA_TAG: {
        'local': {
            'source': {
                'host': '127.0.0.1',
                'username': 'root',
                'password': 'P@ssw0rd',
                'db_name': 'db_data_gateway',
                'port': 13501,
                'tb_name': 'history',
            },
            'target': {
                'host': '127.0.0.1',
                'port': 13502,
                'username': 'root',
                'password': 'P@ssw0rd',
                'db_name': 'db_bat_kaltim2',
            },
        },
        'server': {
            'source': {
                'host': '192.168.1.101',
                'username': 'root',
                'password': 'P@ssw0rd',
                'db_name': 'db_data_gateway',
                'port': 3306,
                'tb_name': 'history',
            },
            'target': {
                'host': '192.168.0.106',
                'username': 'root',
                'password': 'P@ssw0rd',
                'db_name': 'db_bat_kaltim2',
                'port': 3306,
            },
        },
    },
}

SSH_TUNNELING_MAPPING = {
    KTT1_DATA_TAG: {
        'ssh': '10.7.1.116',
        'ssh_port': 22042,
        'username': 'ekky',
        'password': 'smlsub2023',
        'remote_access': '10.7.19.140',
        'remote_access_port_data_source': 3306,
        'remote_access_port_data_target': 3307,
        'local_access': '127.0.0.1',
        'local_access_port_data_source': 13401,
        'local_access_port_data_target': 13402,
    },
    KTT2_DATA_TAG: {
        'ssh': '10.7.1.116',
        'ssh_port': 22042,
        'username': 'ekky',
        'password': 'smlsub2023',
        'remote_access': '10.7.19.140',
        'remote_access_port_data_source': 3306,
        'remote_access_port_data_target': 3308,
        'local_access': '127.0.0.1',
        'local_access_port_data_source': 13501,
        'local_access_port_data_target': 13502,
    },
}