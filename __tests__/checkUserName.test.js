const checkUserName = require('../back_end/myModule/database/user/checkUserName'); // Thay 'your-file-name' bằng tên file của bạn
const sql = require('mssql');

// Mock connection pool và request
jest.mock('mssql', () => {
    const mssql = {
        connect: jest.fn().mockResolvedValue(),
        ConnectionPool: jest.fn().mockImplementation(() => ({
            request: jest.fn().mockReturnThis(),
            input: jest.fn().mockReturnThis(),
            query: jest.fn().mockResolvedValue({ recordset: [mockUser] })
        }))
    };
    return mssql;
});

describe('checkUserName', () => {
    let mockPool;

    // beforeEach(() => {
    //     // Tạo mock pool và request trước mỗi test case
    //     mockPool = {
    //         request: jest.fn(() => ({
    //             input: jest.fn(() => ({
    //                 query: jest.fn(),
    //             })),
    //         })),
    //     };
    //     global.pool = mockPool; // Gán mock pool vào global
    // });

    it('should return user data if user exists', async () => {
        const mockUser = { UserName: 'doanhieu18', Email: 'doanhieu180204@gmail.com', Phone: '0325413488' };
        //mockPool.request().input().query.mockResolvedValue({ recordset: [mockUser] });

        const user = await checkUserName('doanhieu18');
        expect(user).toEqual(mockUser);
        expect(mockPool.request().input).toHaveBeenCalledWith('account', sql.VarChar, 'doanhieu18'); // Kiểm tra input được gọi đúng
        expect(mockPool.request().input().query).toHaveBeenCalled(); // Kiểm tra query được gọi
    });

    it('should return undefined if user does not exist', async () => {
        mockPool.request().input().query.mockResolvedValue({ recordset: [] });

        const user = await checkUserName('nonexistentuser');
        expect(user).toBeUndefined();
        expect(mockPool.request().input).toHaveBeenCalledWith('account', sql.VarChar, 'nonexistentuser'); // Kiểm tra input được gọi đúng
        expect(mockPool.request().input().query).toHaveBeenCalled(); // Kiểm tra query được gọi
    });

    it('should handle errors gracefully', async () => {
        const errorMessage = 'Database connection error';
        mockPool.request().input().query.mockRejectedValue(new Error(errorMessage));
        console.log = jest.fn(); // Mock console.log để kiểm tra lỗi được log

        const user = await checkUserName('plinhneee');
        expect(user).toBeUndefined();
        expect(console.log).toHaveBeenCalledWith('Error', new Error(errorMessage)); // Kiểm tra lỗi được log
    });

    it('should handle special characters in account name', async () => {
        const mockUser = { UserName: 'test.user', Email: 'test@example.com', Phone: '1234567890' };
        mockPool.request().input().query.mockResolvedValue({ recordset: [mockUser] });

        const user = await checkUserName('test.user');
        expect(user).toEqual(mockUser);
        expect(mockPool.request().input).toHaveBeenCalledWith('account', sql.VarChar, 'test.user');
        expect(mockPool.request().input().query).toHaveBeenCalled();
    });
});