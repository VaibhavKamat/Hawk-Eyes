import os


def write_file(filename, bstr):
    with open(filename, 'wb') as afile:
        afile.write(bstr)


def read_file(filename):
    with open(filename, 'rb') as afile:
        return afile


def delete_all_files(directory):
    folder = directory
    for the_file in os.listdir(folder):
        file_path = os.path.join(folder, the_file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            # elif os.path.isdir(file_path): shutil.rmtree(file_path)
        except Exception as e:
            print(e)
