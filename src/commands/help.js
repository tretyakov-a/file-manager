const help = () => (
`up - Go upper from current directory (when you are in the root folder this operation shouldn't change working directory)
cd path_to_directory - Go to dedicated folder from current directory (path_to_directory can be relative or absolute)
ls - List all files and folder in current directory and print it to console
Basic operations with files
cat path_to_file - Read file and print it's content in console
add new_file_name - Create empty file in current working directory
rn path_to_file new_filename - Rename file
cp path_to_file path_to_new_directory - Copy file
mv path_to_file path_to_new_directory - Move file (same as copy but initial file is deleted)
rm path_to_file - Delete file
os [<option>] Operating system info (prints following information in console)
  --EOL - Get EOL (default system End-Of-Line)
  --cpus - Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them)
  --homedir - Get home directory
  --username - Get current system user name (Do not confuse with the username that is set when the application starts)
  --architecture - Get CPU architecture for which Node.js binary has compiled
hash path_to_file - Calculate hash for file and print it into console
compress path_to_file path_to_destination - Compress file (using Brotli algorytm)
decompress path_to_file path_to_destination - Decompress file (using Brotli algorytm)`
)

export default help;
